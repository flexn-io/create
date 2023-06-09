import { Lightning, Router, Utils } from '@lightningjs/sdk';
import { THEME, LAYOUT, ROUTES, THEME_LIGHT } from '../config';
import { getHexColor } from '../utils';

type Item = { text: string; style: { flexItem: Lightning.Element.FlexItem } };
interface MenuItemTemplateSpec extends Lightning.Component.TemplateSpec {
    isVisible: boolean;
    itemColor: number;
    Text: object;
    item: Item;
}

class MenuItem
    extends Lightning.Component<MenuItemTemplateSpec>
    implements Lightning.Component.ImplementTemplateSpec<MenuItemTemplateSpec>
{
    private _item: Item | undefined;

    static _template() {
        return {
            rect: true,
            w: 60,
            h: 60,
            src: '',
            flexItem: { marginBottom: 40 },
            Text: {
                x: -220,
                text: {
                    text: '',
                    textColor: getHexColor('#000000'),
                    fontFace: THEME.light.primaryFontFamily,
                },
            },
        };
    }

    _init() {
        this.patch({
            Text: {
                text: {
                    text: this._item?.text,
                },
            },
        });
        if (this._item?.style?.flexItem) {
            this.patch({
                flexItem: this._item?.style.flexItem,
            });
        }
    }

    _focus() {
        this.smooth = { scale: 1.1 };
    }

    _unfocus() {
        this.smooth = { scale: 1 };
    }

    set item(item: Item) {
        this._item = item;
    }

    set isVisible(val: boolean) {
        this.patch({
            Text: {
                smooth: { x: val ? 90 : -220 },
            },
        });
    }

    set itemColor(val: number) {
        this.patch({ Text: { text: { textColor: val } } });
    }
}

interface SideMenuTemplateSpec extends Lightning.Component.TemplateSpec {
    Container: object;
}

class SideMenu
    extends Lightning.Component<SideMenuTemplateSpec>
    implements Lightning.Component.ImplementTemplateSpec<SideMenuTemplateSpec>
{
    Container = this.getByRef('Container');

    static _template(): Lightning.Component.ImplementTemplateSpec<SideMenuTemplateSpec> {
        return {
            rect: true,
            w: 100,
            h: LAYOUT.h,
            x: 0,
            y: 0,
            color: getHexColor('#FFFFFF'),
            Container: {
                w: 100,
                h: LAYOUT.h,
                flex: { justifyContent: 'center', alignItems: 'center', direction: 'column' },
                children: [
                    {
                        type: MenuItem,
                        src: Utils.asset('home-96.png'),
                        item: {
                            text: 'Home',
                            style: {
                                flexItem: { marginBottom: 40 },
                            },
                            signals: {
                                onPress: '_onPress',
                            },
                            route: ROUTES.HOME,
                        },
                    },
                    {
                        type: MenuItem,
                        src: Utils.asset('grid-96.png'),
                        item: {
                            text: 'Carousels',
                            style: {
                                flexItem: { marginBottom: 40 },
                            },
                            route: ROUTES.CAROUSELS,
                        },
                    },
                    {
                        type: MenuItem,
                        src: Utils.asset('albums-100.png'),
                        item: {
                            text: 'Modal',
                        },
                        route: ROUTES.MODAL,
                    },
                ],
            },
        };
    }

    private focusIndex = 0;

    _init() {
        this.focusIndex = 0;
    }

    static _states() {
        return [
            class LightTheme extends this {
                $enter() {
                    this.patch({ color: getHexColor('#FFFFFF') });
                    // this.Container.children.forEach((_ch) => {
                    //     // ch.patch({ color: getHexColor('#000000') });
                    // });
                }
            },
            class DarkTheme extends this {
                $enter() {
                    this.patch({ color: getHexColor('#000000') });
                    // this.Container.children.forEach((_ch) => {
                    //     // ch.patch({ color: getHexColor('#FFFFFF') });
                    // });
                }
            },
        ];
    }

    onThemeChanged(theme: string) {
        this._setState(theme === THEME_LIGHT ? 'LightTheme' : 'DarkTheme');
    }

    override _getFocused() {
        if (this.Container) {
            return this.Container.children[this.focusIndex] as MenuItem;
        }
    }

    override _handleDown() {
        if (this.Container && this.focusIndex !== this.Container.children.length - 1) {
            this.focusIndex++;
        }
    }

    override _handleLeft() {
        return;
    }

    override _handleUp() {
        if (this.focusIndex !== 0) {
            this.focusIndex--;
        }
    }

    override _focus() {
        this._animate(true);
    }

    override _unfocus() {
        this._animate(false);
    }

    override _handleEnter() {
        const routes = [ROUTES.HOME, ROUTES.CAROUSELS, ROUTES.MODAL];
        Router.navigate(routes[this.focusIndex]);
    }

    _animate(shouldOpen: boolean) {
        if (this.Container) {
            this.Container.children.forEach((ch) => {
                ch.patch({ isVisible: shouldOpen });
            });

            this.patch({
                smooth: {
                    w: shouldOpen ? 390 : 100,
                },
            });
        }
    }
}

export default SideMenu;

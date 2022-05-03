import { Lightning, Router, Utils } from '@lightningjs/sdk';
import { LAYOUT, ROUTES, THEME_LIGHT } from '../config';
import { getHexColor } from '../utils';

class MenuItem extends Lightning.Component {
    static _template() {
        return {
            rect: true,
            w: 60,
            h: 60,
            src: '',
            flexItem: { marginBottom: 40 },
            Text: {
                x: -200,
                text: {
                    text: '',
                    textColor: getHexColor('#000000'),
                },
            },
        };
    }

    _init() {
        this.patch({
            Text: {
                text: {
                    text: this.item.text,
                },
            },
        });
        if (this.item.style?.flexItem) {
            this.patch({
                flexItem: this.item.style.flexItem,
            });
        }
    }

    _focus() {
        this.smooth = { scale: 1.1 };
    }

    _unfocus() {
        this.smooth = { scale: 1 };
    }

    set visible(val) {
        this.patch({
            Text: {
                smooth: { x: val ? 90 : -200 },
            },
        });
    }

    set color(val) {
        this.patch({ Text: { text: { textColor: val } } });
    }
}

class SideMenu extends Lightning.Component {
    static _template() {
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

    _init() {
        this.focusIndex = 0;
    }

    static _states() {
        return [
            class LightTheme extends this {
                $enter() {
                    this.patch({ color: getHexColor('#FFFFFF') });
                    this.tag('Container').children.forEach((ch) => {
                        ch.patch({ color: getHexColor('#000000') });
                    });
                }
            },
            class DarkTheme extends this {
                $enter() {
                    this.patch({ color: getHexColor('#000000') });
                    this.tag('Container').children.forEach((ch) => {
                        ch.patch({ color: getHexColor('#FFFFFF') });
                    });
                }
            },
        ];
    }

    onThemeChanged(theme) {
        this._setState(theme === THEME_LIGHT ? 'LightTheme' : 'DarkTheme');
    }

    _getFocused() {
        return this.tag('Container').children[this.focusIndex];
    }

    _handleDown() {
        if (this.focusIndex !== this.tag('Container').children.length - 1) {
            this.focusIndex++;
        }
    }

    _handleLeft() {
        return;
    }

    _handleUp() {
        if (this.focusIndex !== 0) {
            this.focusIndex--;
        }
    }

    _focus() {
        this._animate(true);
    }

    _unfocus() {
        this._animate(false);
    }

    _handleEnter() {
        const routes = [ROUTES.HOME, ROUTES.CAROUSELS, ROUTES.MODAL];
        Router.navigate(routes[this.focusIndex]);
    }

    _animate(shouldOpen) {
        this.tag('Container').children.forEach((ch) => {
            ch.patch({ visible: shouldOpen });
        });

        this.patch({
            smooth: {
                w: shouldOpen ? 390 : 100,
                Border: { w: shouldOpen ? 390 : 100 },
            },
        });
    }
}

export default SideMenu;

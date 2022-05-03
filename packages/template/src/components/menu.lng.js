import { Lightning, Router, Utils } from '@lightningjs/sdk';
import { LAYOUT, ROUTES, getHexColor, THEME_LIGHT } from '../config';

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
            src: this.item.src,
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
        this.patch({ smooth: { scale: 1.2 } });
    }

    _unfocus() {
        this.patch({ smooth: { scale: 1 } });
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
                        item: {
                            src: Utils.asset('home-96.png'),
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
                        item: {
                            src: Utils.asset('grid-96.png'),
                            text: 'Carousels',
                            style: {
                                flexItem: { marginBottom: 40 },
                            },
                            route: ROUTES.CAROUSELS,
                        },
                    },
                    {
                        type: MenuItem,
                        item: {
                            text: 'Modal',
                            src: Utils.asset('search-96.png'),
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

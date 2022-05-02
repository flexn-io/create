/* eslint-disable no-underscore-dangle */
import { Lightning, Utils, Router } from '@lightningjs/sdk';
import { LAYOUT, ROUTES, getHexColor, THEME_LIGHT, THEME_DARK } from '../config';
import Button from '../components/button.lng';

window.theme = THEME_LIGHT;

export default class Home extends Lightning.Component {
    static _template() {
        return {
            rect: true,
            w: LAYOUT.w,
            h: LAYOUT.h,
            color: getHexColor('#FFFFFF'),
            flex: { justifyContent: 'center', direction: 'column', alignItems: 'center' },
            Logo: {
                w: 200,
                h: 200,
                src: Utils.asset('logo.png'),
                flexItem: { marginBottom: 50 },
            },
            Text1: this._renderText('Flexn SDK Example', 56),
            Text2: this._renderText('v 0.13.1', 40),
            Text3: this._renderText('platform: tvos', 30),
            Text4: this._renderText('factor: tv', 30),
            Text5: this._renderText('engine: engine-lng', 30),
            Button1: {
                type: Button,
                title: 'Try me!',
                y: 50,
                opacity: 0,
                signals: {
                    onPress: '_onPressBtn1',
                },
            },
            Button2: {
                type: Button,
                title: 'Now try me!',
                y: 80,
                opacity: 0,
                signals: {
                    onPress: '_onPressBtn2',
                },
            },
            Text6: {
                y: 90,
                ...this._renderText('Explore More', 30),
            },
        };
    }

    static _renderText(text, size) {
        return {
            text: {
                text: text,
                fontSize: size,
                textColor: getHexColor('#000000'),
            },
        };
    }

    _construct() {
        this.focusIndex = 0;
    }

    _init() {
        this._setState(window.theme);
    }

    static _states() {
        return [
            class LightTheme extends this {
                $enter() {
                    this.patch({
                        color: getHexColor('#FFFFFF'),
                        Button1: { textColor: getHexColor('#000000') },
                        Button2: { textColor: getHexColor('#000000') },
                    });
                    ['Text1', 'Text2', 'Text3', 'Text4', 'Text5', 'Text6'].forEach((key) => {
                        this.patch({ [key]: { text: { textColor: getHexColor('#000000') } } });
                    });
                    window.theme = THEME_LIGHT;
                    this.widgets.sidemenu.onThemeChanged(THEME_LIGHT);
                }
            },
            class DarkTheme extends this {
                $enter() {
                    this.patch({
                        color: getHexColor('#000000'),
                        Button1: { textColor: getHexColor('#FFFFFF') },
                        Button2: { textColor: getHexColor('#FFFFFF') },
                    });
                    ['Text1', 'Text2', 'Text3', 'Text4', 'Text5', 'Text6'].forEach((key) => {
                        this.patch({ [key]: { text: { textColor: getHexColor('#FFFFFF') } } });
                    });
                    window.theme = THEME_DARK;
                    this.widgets.sidemenu.onThemeChanged(THEME_DARK);
                }
            },
        ];
    }

    _onPressBtn1() {
        if (window.theme === THEME_LIGHT) {
            this._setState('DarkTheme');
        } else {
            this._setState('LightTheme');
        }
    }

    _onPressBtn2() {
        Router.navigate(ROUTES.CAROUSELS);
    }

    _handleUp() {
        if (this.focusIndex !== 0) {
            this.focusIndex--;
        }
    }

    _handleDown() {
        if (this.focusIndex !== 1) {
            this.focusIndex++;
        }
    }

    _getFocused() {
        return this.focusIndex === 0 ? this.tag('Button1') : this.tag('Button2');
    }
}

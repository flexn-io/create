/* eslint-disable no-underscore-dangle */
import { Lightning, Utils, Router } from '@lightningjs/sdk';
import { LAYOUT, ROUTES, THEME, THEME_LIGHT, THEME_DARK } from '../config';
import { getHexColor } from '../utils';
import Button from '../components/button.lng';
import packageJson from '../../package.json';

window.theme = THEME_LIGHT;

interface HomeTemplateSpec extends Lightning.Component.TemplateSpec {
    color: number;
    widgets: object;
    Button0: typeof Button;
    Button1: typeof Button;
    Icons: {
        Icon2: typeof Icon;
        Icon3: typeof Icon;
        Icon4: typeof Icon;
    };
}

export interface HomeTypeConfig extends Lightning.Component.TypeConfig {
    IsPage: true;
}

class Icon extends Lightning.Component {
    static _template() {
        return {
            flexItem: { marginRight: 10, marginLeft: 10 },
            src: '',
            w: 60,
            h: 60,
        };
    }

    override _focus() {
        this.smooth = { scale: 1.2 };
    }

    _unfocus() {
        this.smooth = { scale: 1 };
    }
}
export default class Home
    extends Lightning.Component<HomeTemplateSpec, HomeTypeConfig>
    implements Lightning.Component.ImplementTemplateSpec<HomeTemplateSpec>
{
    static _template() {
        return {
            rect: true,
            w: LAYOUT.w,
            h: LAYOUT.h,
            color: getHexColor('#FFFFFF'),
            flex: { justifyContent: 'center', direction: 'column', alignItems: 'center' } as const,
            Logo: {
                w: 200,
                h: 200,
                src: Utils.asset('logo.png'),
                flexItem: { marginBottom: 50 },
            },
            Text1: this._renderText('Flexn Create Example', 56),
            Text2: this._renderText(`v ${packageJson.version}`, 40),
            Text3: this._renderText('platform: tizen/webos', 30),
            Text4: this._renderText('factor: tv', 30),
            Text5: this._renderText('engine: engine-lng', 30),
            Button0: {
                type: Button,
                title: 'Try me!',
                y: 50,
                signals: {
                    onPress: '_onPressBtn1',
                },
            },
            Button1: {
                type: Button,
                title: 'Now try me!',
                y: 80,
                signals: {
                    onPress: '_onPressBtn2',
                },
            },
            Text6: {
                y: 100,
                ...this._renderText('Explore More', 30),
            },
            Icons: {
                y: 120,
                flex: { justifyContent: 'center', direction: 'row', alignItems: 'center' },
                Icon2: {
                    type: Icon,
                    src: Utils.asset('github-90.png'),
                },
                Icon3: {
                    type: Icon,
                    src: Utils.asset('chrome-96.png'),
                },
                Icon4: {
                    type: Icon,
                    src: Utils.asset('twitter-90.png'),
                },
            },
        };
    }

    static _renderText(text: string, size: number) {
        return {
            text: {
                text: text,
                fontSize: size,
                textColor: getHexColor('#000000'),
                fontFace: THEME.light.primaryFontFamily,
            },
        };
    }

    private focusIndex = 0;
    // private widgets?: object;

    _construct() {
        this.focusIndex = 0;
    }

    _init() {
        this._setState(window.theme === THEME_LIGHT ? 'LightTheme' : 'DarkTheme');
    }

    static _states() {
        return [
            class LightTheme extends this {
                $enter() {
                    this.patch({
                        color: getHexColor('#FFFFFF'),
                        Button0: { textColor: getHexColor('#000000'), opacity: 100 },
                        Button1: { textColor: getHexColor('#000000'), opacity: 100 },
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
                        Button0: { text: { textColor: getHexColor('#FFFFFF') }, opacity: 0 },
                        Button1: { text: { textColor: getHexColor('#FFFFFF') }, opacity: 0 },
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
        if (this.focusIndex > 1) {
            this.focusIndex = 1;
        } else if (this.focusIndex === 1) {
            this.focusIndex = 0;
        }
    }

    _handleDown() {
        if (this.focusIndex !== 2) {
            this.focusIndex++;
        }
    }

    _handleLeft() {
        if (this.focusIndex > 2) {
            this.focusIndex--;
        } else {
            Router.focusWidget('SideMenu');
        }
    }

    _handleRight() {
        if (this.focusIndex > 1 && this.focusIndex < 4) {
            this.focusIndex++;
        }
    }

    _getFocused() {
        if (this.focusIndex === 0 || this.focusIndex === 1) {
            return this.tag(`Button${this.focusIndex}`);
        }

        if (this.focusIndex === 2 || this.focusIndex === 3 || this.focusIndex === 4) {
            return this.tag(`Icons.Icon${this.focusIndex}`);
        }
    }
}

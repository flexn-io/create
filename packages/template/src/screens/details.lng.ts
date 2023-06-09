/* eslint-disable no-underscore-dangle */
import { Lightning, Router } from '@lightningjs/sdk';
import { LAYOUT, ROUTES, THEME_DARK, THEME } from '../config';
import { getHexColor, getRandomItem } from '../utils';
import Button from '../components/button.lng';

interface DetailsTemplateSpec extends Lightning.Component.TemplateSpec {
    Text: { text: { textColor: number } };
    Button1: typeof Button;
    Button2: typeof Button;
}

export interface DetailsTypeConfig extends Lightning.Component.TypeConfig {
    IsPage: true;
}

export default class Details
    extends Lightning.Component<DetailsTemplateSpec, DetailsTypeConfig>
    implements Lightning.Component.ImplementTemplateSpec<DetailsTemplateSpec>
{
    static override _template(): Lightning.Component.Template<DetailsTemplateSpec> {
        return {
            rect: true,
            color: getHexColor('#FFFFFF'),
            w: LAYOUT.w,
            h: LAYOUT.h,
            src: '',
            flex: { justifyContent: 'center', direction: 'column', alignItems: 'center' } as const,
            Text: {
                text: {
                    fontFace: THEME.light.primaryFontFamily,
                    textColor: getHexColor('#000000'),
                    text: '',
                },
            },
            Button1: {
                type: Button,
                title: 'Go back',
                y: 50,
                opacity: 0,
                textColor: getHexColor('#000000'),
                signals: {
                    onPress: '_onPressBtn1',
                },
            },
            Button2: {
                type: Button,
                title: 'Go to home',
                y: 120,
                opacity: 0,
                textColor: getHexColor('#000000'),
                signals: {
                    onPress: '_onPressBtn2',
                },
            },
        };
    }

    override set params(params: { row: any; index: string }) {
        const { backgroundImage, title } = getRandomItem(params.row, parseInt(params.index)) || {};
        this.patch({
            src: backgroundImage,
            Text: { text: { text: title } },
        });
    }

    private focusIndex = 0;

    _construct() {
        this.focusIndex = 0;
    }

    override _init() {
        if (window.theme === THEME_DARK) {
            const white = getHexColor('#FFFFFF');

            this.patch({
                Button1: { text: { textColor: white } },
                Button2: { text: { textColor: white } },
                Text: { text: { textColor: white } },
            });
        }
    }

    _onPressBtn1() {
        Router.back();
    }

    _onPressBtn2() {
        Router.navigate(ROUTES.HOME);
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

    override _getFocused() {
        return this.focusIndex === 0 ? this.tag('Button1') : this.tag('Button2');
    }
}

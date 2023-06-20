/* eslint-disable no-underscore-dangle */
import { Lightning, Utils, Router } from '@lightningjs/sdk';
import { LAYOUT, THEME_LIGHT, THEME } from '../config';
import { getHexColor } from '../utils';

interface ModalTemplateSpec extends Lightning.Component.TemplateSpec {
    color: number;
    Text: object;
    Close: object;
}

export interface ModelTypeConfig extends Lightning.Component.TypeConfig {
    IsPage: true;
}
export default class Modal
    extends Lightning.Component<ModalTemplateSpec, ModelTypeConfig>
    implements Lightning.Component.ImplementTemplateSpec<ModalTemplateSpec>
{
    Close = this.getByRef('Close');

    static _template(): Lightning.Component.Template<ModalTemplateSpec> {
        return {
            rect: true,
            w: LAYOUT.w,
            h: LAYOUT.h,
            color: getHexColor('#FFFFFF'),
            Close: {
                w: 40,
                h: 40,
                x: (x: number) => x - 90,
                y: 50,
                src: Utils.asset('close-90.png'),
            },
            Text: {
                x: LAYOUT.w / 2,
                y: LAYOUT.h / 2,
                mount: 0.5,
                text: {
                    text: 'This is my Modal!',
                    textColor: getHexColor('#000000'),
                    fontFace: THEME.light.primaryFontFamily,
                },
            },
        };
    }

    _init() {
        const color = window.theme === THEME_LIGHT ? getHexColor('#FFFFFF') : getHexColor('#000000');
        const textColor = window.theme === THEME_LIGHT ? getHexColor('#000000') : getHexColor('#FFFFFF');
        this.patch({ color, Text: { text: { textColor } } });
    }

    override _getFocused() {
        return this.tag('Close') as Lightning.Component;
    }

    _focus() {
        if (this.Close) {
            this.Close.patch({ smooth: { scale: 1.2 } });
        }
    }

    _handleEnter() {
        Router.back();
    }
}

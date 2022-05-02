/* eslint-disable no-underscore-dangle */
import { Lightning, Utils, Router } from '@lightningjs/sdk';
import { LAYOUT, getHexColor } from '../config';

export default class Modal extends Lightning.Component {
    static _template() {
        return {
            rect: true,
            color: getHexColor('#FFFFFF'),
            w: LAYOUT.w,
            h: LAYOUT.h,
            src: '',
            Close: {
                w: 40,
                h: 40,
                x: (x) => x - 50,
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
                },
            },
        };
    }

    _init() {
        const color = window.theme === 'LightTheme' ? getHexColor('#FFFFFF') : getHexColor('#000000');
        this.patch({ color });
    }

    _getFocused() {
        this.tag('Close');
    }

    _focus() {
        this.tag('Close').patch({ smooth: { scale: 1.2 } });
    }

    _handleEnter() {
        Router.back();
    }
}

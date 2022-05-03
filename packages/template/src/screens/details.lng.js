/* eslint-disable no-underscore-dangle */
import { Lightning, Router } from '@lightningjs/sdk';
import { LAYOUT, ROUTES } from '../config';
import { getRandomData, getHexColor } from '../utils';
import Button from '../components/button.lng';
import {  THEME_DARK } from '../config.lng';

export default class Details extends Lightning.Component {
    static _template() {
        return {
            rect: true,
            color: getHexColor('#FFFFFF'),
            w: LAYOUT.w,
            h: LAYOUT.h,
            src: '',
            flex: { justifyContent: 'center', direction: 'column', alignItems: 'center' },
            Text: {
                text: {
                    textColor: getHexColor('#000000'),
                    text: ''
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

    set params(params) {
        const { backgroundImage, title } = getRandomData(params.row, params.index);
        this.patch({
            src: backgroundImage,
            Text: { text: { text: title } },
        });
    }

    _construct() {
        this.focusIndex = 0;
    }

    _init() {
        if (window.theme === THEME_DARK) {
            const white = getHexColor('#FFFFFF');
            this.patch({
                Button1: { textColor: white },
                Button2: { textColor: white },
                Text: { text: { textColor: white } }
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

    _getFocused() {
        return this.focusIndex === 0 ? this.tag('Button1') : this.tag('Button2');
    }
}

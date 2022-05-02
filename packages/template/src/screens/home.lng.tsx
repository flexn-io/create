/* eslint-disable no-underscore-dangle */
import { Lightning, Utils } from '@lightningjs/sdk';
import { LAYOUT, getHexColor } from '../config';
import Button from '../components/button.lng';
import Screen from './screen.lng';

export default class Home extends Screen {
    focusIndex = 0;

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
                flexItem: { marginBottom: 50 }
            },
            Text1: this._renderText('Flexn SDK Example', 56),
            Text2: this._renderText('v 0.13.1', 40),
            Text3: this._renderText('platform: tvos', 30),
            Text4: this._renderText('factor: tv', 30),
            Text5: this._renderText('engine: engine-lng', 30),
            Button1: {
                type: Button,
                title: 'Try me!',
                style: { y: 50 },
                signals: {
                    onPress: '_onPressBtn1'
                }
            },
            Button2: {
                type: Button,
                title: 'Now try me!',
                style: { y: 80 },
                signals: {
                    onPress: '_onPressBtn2'
                }
            },
            Text6: {
                y: 90,
                ...this._renderText('Explore More', 30)
            }
        };
    }

    static _renderText(text: string, size: number) {
        return {
            text: {
                text: text,
                fontSize: size,
                textColor: getHexColor('#000000'),
            } 
        };
    }

    _construct() {
        super._construct();
        this.focusIndex = 0;
    }

    _onPressBtn1() {
        if (this.theme === 'LightTheme') {
            this._setState('DarkTheme');
        } else {
            this._setState('LightTheme');
        }
    }

    _onPressBtn2() {
        console.log('PRESSED 2');
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
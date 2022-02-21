/* eslint-disable no-underscore-dangle */

import { Lightning } from '@lightningjs/sdk';
import debounce from 'lodash.debounce';

export default class Button extends Lightning.Component {
    static _template() {
        return {
            w: 400,
            h: 50,
            flexItem: { marginTop: 10 },
            flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
            rect: true,
            color: 0xffa7a7a7,
            texture: Lightning.Tools.getRoundRect(150, 50, 25, 2, 0xff008080, false),
            Label: {
                text: {
                    text: '',
                },
            },
        };
    }

    _init() {
        this.animationOnEnter = this.animation({
            duration: 1,
            repeat: 0,
            stopMethod: 'immediate',
            actions: [
                {
                    p: 'alpha',
                    v: { 0: 0.5, 0.5: 1 },
                },
            ],
        });
    }

    set label(passedLabel) {
        this.patch({
            Label: {
                text: {
                    text: passedLabel,
                    fontFace: 'Inter-Light',
                    fontSize: 25,
                    textColor: 0xff008080,
                },
            },
        });
    }

    onButtonPress() {
        if (this.onPress) {
            this.animationOnEnter.start();
            this.onPress();
        }
    }

    _handleEnter() {
        this.onButtonPress = debounce(this.onButtonPress, 250, {
            leading: true,
            trailing: false,
        });
        this.signal('onPress');
        this.onButtonPress();
    }

    _focus() {
        this.patch({ smooth: { alpha: 1, scale: 1.2 } });
    }

    _unfocus() {
        this.patch({ smooth: { alpha: 0.8, scale: 1 } });
    }
}

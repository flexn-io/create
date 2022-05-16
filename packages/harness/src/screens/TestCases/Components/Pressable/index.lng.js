import { Lightning } from '@lightningjs/sdk';
import { Pressable } from '@flexn/sdk';

export default class Press extends Lightning.Component {
    static _template() {
        return {
            w: 1920,
            h: 1080,
            flex: { justifyContent: 'center', alignItems: 'center', direction: 'column' },
            children: [
                {
                    type: Pressable,
                    w: 300,
                    h: 80,
                    texture: Lightning.Tools.getRoundRect(300, 80, 25, 2, 0xff008080, false),
                    signals: {
                        onPress: '_onPress',
                        onFocus: '_onFocus',
                        onBlur: '_onBlur',
                    },
                },
                {
                    type: Pressable,
                    w: 300,
                    h: 80,
                    y: 30,
                    texture: Lightning.Tools.getRoundRect(300, 80, 25, 2, 0xff008080, false),
                    signals: {
                        onPress: '_onPress',
                        onFocus: '_onFocus',
                        onBlur: '_onBlur',
                    },
                },
            ],
        };
    }

    _construct() {
        this._focusIndex = 0;
    }

    _onPress() {
        // TODO: implementation
    }

    _onFocus() {
        // TODO: implementation
    }

    _onBlur() {
        // TODO: implementation
    }

    _handleDown() {
        if (this._focusIndex < this.children.length - 1) {
            this._focusIndex++;
        }
    }

    _handleUp() {
        if (this.focusIndex !== 0) {
            this._focusIndex--;
        }
    }

    _getFocused() {
        return this.children[this._focusIndex];
    }
}

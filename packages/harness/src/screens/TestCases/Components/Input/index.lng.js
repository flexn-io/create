import { Lightning } from '@lightningjs/sdk';
import { TextInput } from '@flexn/sdk';

export default class InputTest extends Lightning.Component {
    static _template() {
        return {
            rect: true,
            color: 4294967295,
            w: 1920,
            h: 1080,
            children: [
                {
                    type: TextInput,
                    input: {
                        x: 1920 / 2,
                        y: 1080 / 2 - 100,
                        mount: 0.5,
                    },
                    keyboard: {
                        x: 1920 / 2 - 400,
                        y: 1080 / 2 + 100,
                    },
                },
                {
                    type: TextInput,
                    input: {
                        x: 1920 / 2,
                        y: 1080 / 2,
                        mount: 0.5,
                    },
                    keyboard: {
                        x: 1920 / 2 - 400,
                        y: 1080 / 2 + 100,
                    },
                },
            ],
        };
    }

    _construct() {
        this._focusIndex = 0;
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

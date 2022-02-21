/* eslint-disable no-underscore-dangle */
import { Lightning } from '@lightningjs/sdk';
import Button from '../Button';

export default class Drawer extends Lightning.Component {
    static _template() {
        return {
            rect: true,
            color: 0x80ff0000,
            w: 1920 * 0.25,
            h: 1080,
            zIndex: 1,
            flex: { direction: 'column', alignItems: 'center', justifyContent: 'center' },
            children: [],
        };
    }

    _init() {
        this.focusIndex = 0;
    }

    set items(items) {
        this.patch({
            children: items.map(() => ({
                flexItem: { marginBottom: 20 },
                type: Button,
            })),
        });
    }

    _setFocusIndex(idx) {
        this.focusIndex = idx;
    }

    _handleUp() {
        if (this.focusIndex > 0) {
            this._setFocusIndex(this.focusIndex - 1);
        }
    }

    _handleDown() {
        if (this.focusIndex < this.children.length - 1) {
            this._setFocusIndex(this.focusIndex + 1);
        }
    }

    _handleRight() {
        this.signal('blur');
    }

    _getFocused() {
        return this.children[this.focusIndex];
    }
}

import Lightning from '@lightningjs/core';

export default class Pressable extends Lightning.Component {
    static _template() {
        return {
            w: 0,
            h: 0,
        };
    }

    _construct() {
        this._disableDefaultAnimation = false;
    }

    _init() {
        this._disableDefaultAnimation = this.disableDefaultAnimation;
    }

    get disableDefaultAnimation() {
        return this._disableDefaultAnimation;
    }

    set disableDefaultAnimation(val) {
        this._disableDefaultAnimation = val;
    }

    _handleEnter() {
        this.signal('onPress');
    }

    _focus() {
        if (!this.disableDefaultAnimation) {
            this.smooth = { scale: 1.2 };
        }
        this.signal('onFocus');
    }

    _unfocus() {
        if (!this.disableDefaultAnimation) {
            this.smooth = { scale: 1 };
        }
        this.signal('onBlur');
    }
}

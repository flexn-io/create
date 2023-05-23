import Lightning from '@lightningjs/core';
import { getHexColor } from '../../helpers';

const DEFAULT_DIMENSIONS = {
    w: 250,
    h: 250,
};
export default class Card extends Lightning.Component {
    static _template() {
        return {
            rect: true,
            Image: {
                rtt: true,
                h: DEFAULT_DIMENSIONS.h,
                w: DEFAULT_DIMENSIONS.w,
                shader: {
                    type: Lightning.shaders.RoundedRectangle,
                },
                resizeMode: 'contain',
            },
            Text: {
                y: DEFAULT_DIMENSIONS.h + 30,
                w: (w) => w - 50,
                text: {
                    fontSize: 28,
                    maxLinesSuffix: '...',
                    maxLines: 1,
                    textColor: getHexColor('#000000'),
                    text: '',
                },
            },
        };
    }

    _construct() {
        this._whenEnabled = new Promise((resolve) => (this._enable = resolve));
        this._animator = null;
    }

    get _Image() {
        return this.tag('Image');
    }

    get _Text() {
        return this.tag('Text');
    }

    get w() {
        return this._w;
    }

    set w(value) {
        if (value !== this._w) {
            this._w = value;
            this.w = value;

            this._whenEnabled.then(() => {
                this._Image.w = this.w;
            });
        }
    }

    get h() {
        return this._h;
    }

    set h(value) {
        if (value !== this._h) {
            this._h = value;
            this.h = value;

            this._whenEnabled.then(() => {
                this._Image.h = this.h;
                this._Text.y = this.h + 30;
            });
        }
    }

    get src() {
        return this._src;
    }

    set src(value) {
        if (value !== this._src) {
            this._src = value;
            this.src = value;
            this._whenEnabled.then(() => {
                this._Image.src = this.src;
            });
        }
    }

    get title() {
        return this._title;
    }

    set title(value) {
        if (value !== this._title) {
            this._title = value;
            this.title = value;
            this._whenEnabled.then(() => {
                this._Text.text = {
                    text: this.title,
                };
            });
        }
    }

    get focusOptions() {
        return this._focusOptions;
    }

    set focusOptions(value) {
        this._focusOptions = value;
    }

    get eventValue() {
        return this._eventValue;
    }

    set eventValue(item) {
        this._eventValue = item;
    }

    get borderColor() {
        return this._borderColor;
    }

    set borderColor(value) {
        if (value !== this._borderColor) {
            this._borderColor = value;
            this._whenEnabled.then(() => {
                this._Image.shader = {
                    strokeColor: this._borderColor,
                };
            });
        }
    }

    get borderWidth() {
        return this._borderWidth;
    }

    set borderWidth(value) {
        if (value !== this._borderWidth) {
            this._borderWidth = value;
            this._whenEnabled.then(() => {
                this._Image.shader = {
                    stroke: this._borderWidth,
                };
            });
        }
    }

    get borderRadius() {
        return this._borderRadius;
    }

    set borderRadius(value) {
        if (value !== this._borderRadius) {
            this._borderRadius = value;
            this._whenEnabled.then(() => {
                this._Image.shader = {
                    radius: this._borderRadius,
                };
            });
        }
    }

    get fontSize() {
        return this._fontSize;
    }

    set fontSize(value) {
        if (value !== this._fontSize) {
            this._fontSize = value;
            this._whenEnabled.then(() => {
                this._Text.text = {
                    text: this._fontSize,
                };
            });
        }
    }

    get fontColor() {
        return this._fontColor;
    }

    set fontColor(value) {
        if (value !== this._fontColor) {
            this._fontColor = value;
            this._whenEnabled.then(() => {
                this._Text.text = {
                    text: this._fontColor,
                };
            });
        }
    }

    _setAnimationValues() {
        if (this._animator) {
            return this._animator;
        }

        const template = {};

        const { animatorOptions } = this.focusOptions;
        const { type, borderColor, borderWidth, borderRadius, scale: scaleAmount } = animatorOptions;

        const scaleDefault = { scale: 1 };
        const shaderDefault = { stroke: 0 };

        const scale = { scale: scaleAmount };
        const shader = {
            strokeColor: borderColor,
            stroke: borderWidth,
            radius: borderRadius,
        };

        switch (type) {
            case 'scale':
                template.focus = { smooth: scale };
                template.unfocus = { smooth: scaleDefault };
                break;
            case 'scale_with_border':
                template.focus = { smooth: scale, shader };
                template.unfocus = { shader: shaderDefault, smooth: scaleDefault };
                break;
            case 'border':
                template.focus = { shader };
                template.unfocus = { shader: shaderDefault };
                break;
            case 'background_color':
                break;
            default:
                template.focus = { smooth: { scale: 1.2 } };
                template.unfocus = { smooth: scaleDefault };
                break;
        }

        this._animator = template;

        return template;
    }

    _handleEnter() {
        this.fireAncestors('$onCardPress', this.eventValue);
        this.signal('onPress', this.eventValue);
    }

    _focus() {
        // this.fireAncestors('$onCardFocus', this.eventValue);
        // this.signal('onFocus', this.eventValue);
        this.patch({ Image: this._setAnimationValues().focus, zIndex: 1 });
    }

    _unfocus() {
        // this.fireAncestors('$onCardBlur', this.eventValue);
        // this.signal('onBlur', this.eventValue);
        this.patch({ Image: this._setAnimationValues().unfocus, zIndex: 0 });
    }
}

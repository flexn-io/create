import { Lightning } from '@lightningjs/sdk';
import { THEME } from '../config';
import { getHexColor } from '../utils';

class Button extends Lightning.Component {
    static _template() {
        return {
            rect: true,
            w: (w) => w * 0.8,
            h: 100,
            flex: { justifyContent: 'center', alignItems: 'center' },
            texture: this._drawRoundRect(getHexColor(THEME.light.colorBorder), getHexColor(THEME.light.colorBgPrimary)),
            Text: {
                text: {
                    textColor: getHexColor('#000000'),
                    text: '',
                },
            },
        };
    }

    static _drawRoundRect(strokeColor, fillColor) {
        return Lightning.Tools.getRoundRect(800, 100, 25, 2, strokeColor, true, fillColor);
    }

    set textColor(color) {
        this.patch({ Text: { text: { textColor: color } } });
    }

    set title(title) {
        this.patch({ Text: { text: { text: title } } });
    }

    set opacity(opacity) {
        this.patch({
            texture: Button._drawRoundRect(
                getHexColor(THEME.light.colorBorder),
                getHexColor(THEME.light.colorBgPrimary, opacity)
            ),
        });
    }

    _handleEnter() {
        this.signal('onPress');
    }

    _focus() {
        this.patch({
            smooth: {
                color: getHexColor(THEME.light.colorBrand),
            },
        });
    }

    _unfocus() {
        this.patch({
            smooth: {
                color: getHexColor(THEME.light.colorBgPrimary),
            },
        });
    }
}

export default Button;

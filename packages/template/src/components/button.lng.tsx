import { Lightning } from '@lightningjs/sdk';
import { LAYOUT, THEME, getHexColor } from '../config';

class Button extends Lightning.Component {
    // style: any;
    // textStyle: any;
    // title = '';

    static _template() {
        return {
            rect: true,
            w: ((w: number) => w * 0.8),
            h: 100,
            flex: { justifyContent: 'center', alignItems: 'center' },
            texture: this._drawRoundRect(getHexColor(THEME.light.colorBorder), getHexColor(THEME.light.colorBgPrimary)),
            Text: {
                color: getHexColor('#000000'),
                text: { text: '' }
            }
        };
    }

    static _drawRoundRect(strokeColor: string, fillColor: string) {
        return Lightning.Tools.getRoundRect(
            800, //w
            100, // h
            25,  // radius
            2, // strokeWidth
            strokeColor, // strokeColor
            true, // fill
            fillColor // fillColor
        );
    }

    _init() {
        // this._update();
    }

    _update() {
        const style = this.style ? {...this.style} : {};
        const textStyle = this.textStyle ? {...this.textStyle} : {};

        this.patch({
            Text: {...textStyle, text: {text: this.title}},
            ...style
        });
    }

    set style(s: any) {
        const style = s ? {...s} : {};

        this.patch({ ...style });
    }
    
    set textStyle(s: any) {
        const style = s ? {...s} : {};

        this.patch({ Text: {...style }});
    }

    set title(title: string) {
        this.patch({ Text: {  text: {text: title}} });
    }

    set opacity(opacity: number) {
        this.patch({
            texture: Button._drawRoundRect(getHexColor(THEME.light.colorBorder), getHexColor(THEME.light.colorBgPrimary, opacity)),
        });
    }

    _handleEnter() {
        this.signal('onPress');
    }

    _focus() {
        this.patch({
            smooth: {
                color: getHexColor(THEME.light.colorBrand),
            }
        });
    }    
    
    _unfocus() {
        this.patch({
            smooth: {
                color: getHexColor(THEME.light.colorBgPrimary),
            }
        });
    }
}

export default Button;
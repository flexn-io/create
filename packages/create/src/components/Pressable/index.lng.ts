import Lightning from '@lightningjs/core';

interface PressableTemplateSpec extends Lightning.Component.TemplateSpec {
    Button: {
        Ok: object;
    };
    Text: object;
    title: string;
    // opacity: number;
    textColor: number;
}

export function getHexColor(hex: string, alpha = 100) {
    if (!hex) {
        return 0x00;
    }

    if (hex.startsWith('#')) {
        hex = hex.substring(1);
    }

    const hexAlpha = Math.round((alpha / 100) * 255).toString(16);
    const str = `0x${hexAlpha}${hex}`;
    //@ts-ignore
    return parseInt(Number(str), 10);
}

const THEME = {
    primaryFontFamily: 'Inter-Light',
    iconSize: 30,
    buttonSize: 30,
    menuWidth: 280,
    menuHeight: '100%',
    colorBrand: '#0A74E6',
    colorBgPrimary: '#FFFFFF',
    colorTextPrimary: '#000000',
    colorTextSecondary: '#333333',
    colorBorder: '#EEEEEE',
};

export class Pressable
    extends Lightning.Component<PressableTemplateSpec>
    implements Lightning.Component.ImplementTemplateSpec<PressableTemplateSpec>
{
    Button = this.getByRef('Button')!;
    Text = this.getByRef('Text')!;

    static _template(): Lightning.Component.Template<PressableTemplateSpec> {
        return {
            rect: true,
            w: (w: number) => w * 0.8,
            h: 100,
            flex: { justifyContent: 'center', alignItems: 'center' } as const,
            texture: this._drawRoundRect(getHexColor(THEME.colorBorder), getHexColor(THEME.colorBgPrimary)),
            Text: {
                text: {
                    textColor: getHexColor('#000000'),
                    // fontFace: THEME.primaryFontFamily,
                    text: '',
                },
            },
        };
    }

    static _drawRoundRect(strokeColor: number, fillColor: number) {
        return Lightning.Tools.getRoundRect(800, 100, 25, 2, strokeColor, true, fillColor);
    }

    set textColor(color: number) {
        this.patch({ Text: { text: { textColor: color } } });
    }

    set title(title: string) {
        this.patch({ Text: { text: { text: title } } });
    }

    // set opacity(opacity: number) {
    //     this.patch({
    //         texture: this.Button._drawRoundRect(
    //             getHexColor(THEME.colorBorder),
    //             getHexColor(THEME.colorBgPrimary, opacity)
    //         ),
    //     });
    // }

    _handleEnter() {
        // this.signal('onPress');
    }

    _focus() {
        this.patch({
            smooth: {
                color: getHexColor(THEME.colorBrand),
            },
        });
    }

    _unfocus() {
        this.patch({
            smooth: {
                color: getHexColor(THEME.colorBgPrimary),
            },
        });
    }
}

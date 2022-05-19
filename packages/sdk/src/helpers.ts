import { Dimensions, PixelRatio } from 'react-native';
import { isPlatformAndroidtv, isPlatformFiretv } from '@rnv/renative';

export function Ratio(pixels: number): number {
    if (!(isPlatformAndroidtv || isPlatformFiretv)) return pixels;
    const resolution = Dimensions.get('screen').height * PixelRatio.get();

    return Math.round(pixels / (resolution < 2160 ? 2 : 1));
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

export const resolveStyles = (style) => {
    if (style !== null) {
        if (Array.isArray(style)) {
            const flatted = {};
            style.map((item) => {
                item && Object.keys(item) && Object.keys(item).map((key) => (flatted[key] = item[key]));
            });

            return flatted;
        }

        return style;
    }

    return {};
};

import { Dimensions, PixelRatio, Platform } from 'react-native';

export function Ratio(pixels: number): number {
    if (!Platform.isTV) return pixels;
    if (Platform.OS !== 'android') return pixels;
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

    return parseInt(str, 10);
}

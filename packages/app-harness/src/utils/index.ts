import { Dimensions, PixelRatio } from 'react-native';
import { isPlatformAndroidtv, isPlatformFiretv } from '@rnv/renative';
const { height } = Dimensions.get('screen');

export enum CARD_TYPES {
    DEFAULT = 'default',
    PROGRESS = 'progress',
}

export function Ratio(pixels: number): number {
    if (!(isPlatformAndroidtv || isPlatformFiretv)) return pixels;
    const resolution = height * PixelRatio.get();

    return Math.round(pixels / (resolution < 2160 ? 2 : 1));
}

export * from './data/dataGenerator';
export * from './hooks/useParams';
export * from './libs/react-native-google-cast';

import { Dimensions, PixelRatio } from 'react-native';
import {
    isPlatformAndroidtv,
    isPlatformFiretv,
} from '@rnv/renative';
const { height } = Dimensions.get('screen');

const kittyNames = ['Abby', 'Angel', 'Annie', 'Baby', 'Bailey', 'Bandit'];

export function interval(min = 0, max = kittyNames.length - 1) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function generateData(width, height, items = 30) {
    const temp: any = [];
    for (let index = 0; index < items; index++) {
        temp.push({
            index,
            backgroundImage: `https://placekitten.com/${width + index}/${height}`,
            title: `${kittyNames[interval()]} ${kittyNames[interval()]} ${kittyNames[interval()]}`,
        });
    }

    return temp;
}

export function Ratio(pixels: number): number {
    if (!(isPlatformAndroidtv || isPlatformFiretv)) return pixels;
    const resolution = height * PixelRatio.get();

    return Math.round(pixels / (resolution < 2160 ? 2 : 1));
}

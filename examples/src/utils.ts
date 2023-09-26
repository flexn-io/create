import { Platform, Dimensions, PixelRatio } from 'react-native';
import { Item } from './components/Item';

const { height } = Dimensions.get('screen');


export function Ratio(pixels: number): number {
    if (Platform.OS === 'ios') return pixels;
    const resolution = height * PixelRatio.get();

    return Math.round(pixels / (resolution < 2160 ? 2 : 1));
}

export function mixAndMatch(items: Item[], amount = 100) {
    const newItems: Item[] = [];

    for (let index = 0; index < amount; index++) {        
        newItems.push(items[interval(0, items.length - 1)]);
    }

    return shuffleArray(newItems);
}

function shuffleArray(array: Item[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

export function interval(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
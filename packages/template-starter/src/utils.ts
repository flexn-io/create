import { isPlatformAndroid, isPlatformAndroidtv } from '@rnv/renative';
import { getWidth } from './config';

export function testProps(testID: string | undefined) {
    if (!testID) {
        return;
    }
    if (isPlatformAndroid || isPlatformAndroidtv) {
        return { accessibilityLabel: testID, accessible: true };
    }
    return { testID };
}

const kittyNames = [
    'Abby',
    'Angel',
    'Annie',
    'Baby',
    'Bailey',
    'Bandit',
    'Bear',
    'Bella',
    'Bob',
    'Boo',
    'Boots',
    'Bubba',
    'Buddy',
    'Buster',
    'Cali',
    'Callie',
    'Casper',
    'Charlie',
    'Chester',
    'Chloe',
    'Cleo',
    'Coco',
    'Cookie',
    'Cuddles',
    'Daisy',
    'Dusty',
    'Felix',
    'Fluffy',
    'Garfield',
    'George',
    'Ginger',
    'Gizmo',
    'Gracie',
    'Harley',
    'Jack',
    'Jasmine',
    'Jasper',
    'Kiki',
    'Kitty',
    'Leo',
    'Lilly',
    'Lily',
    'Loki',
    'Lola',
    'Lucky',
    'Lucy',
    'Luna',
    'Maggie',
    'Max',
    'Mia',
    'Midnight',
    'Milo',
    'Mimi',
    'Miss kitty',
    'Missy',
    'Misty',
    'Mittens',
    'Molly',
    'Muffin',
    'Nala',
    'Oliver',
    'Oreo',
    'Oscar',
    'Patches',
    'Peanut',
    'Pepper',
    'Precious',
    'Princess',
    'Pumpkin',
    'Rascal',
    'Rocky',
    'Sadie',
    'Salem',
    'Sam',
    'Samantha',
    'Sammy',
    'Sasha',
    'Sassy',
    'Scooter',
    'Shadow',
    'Sheba',
    'Simba',
    'Simon',
    'Smokey',
    'Snickers',
    'Snowball',
    'Snuggles',
    'Socks',
    'Sophie',
    'Spooky',
    'Sugar',
    'Tiger',
    'Tigger',
    'Tinkerbell',
    'Toby',
    'Trouble',
    'Whiskers',
    'Willow',
    'Zoe',
    'Zoey',
];

export function interval(min = 0, max = kittyNames.length - 1) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const data: Array<Array<DataItem>> = [[]];
export type DataItem = {
    index: number;
    backgroundImage: string;
    title: string;
    rowNumber: number;
};
export function generateRandomItemsRow(row: number, itemsInViewport = 6, height = 250, items = 50) {
    const width = Math.floor(getWidth() / itemsInViewport);

    const itemsRow: Array<DataItem> = [];
    let hIndex = 1;
    for (let index = 0; index < items; index++) {
        itemsRow.push({
            index,
            backgroundImage: `https://placekitten.com/${width}/${height + hIndex}`,
            title: `${kittyNames[interval()]} ${kittyNames[interval()]} ${kittyNames[interval()]}`,
            rowNumber: row,
        });

        if (hIndex === 10) {
            hIndex = 1;
        } else {
            hIndex++;
        }
    }

    data[row] = itemsRow;

    return itemsRow;
}

export function getRandomItem(row: number, idx: number) {
    if (data[row] && idx !== undefined) {
        const item = data[row][idx];
        return item;
    }
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

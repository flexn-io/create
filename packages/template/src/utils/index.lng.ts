import { LAYOUT } from '../config';

export function testProps(_testId: string | undefined) {
    return testProps;
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

function interval(min = 0, max = kittyNames.length - 1) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const data = {};
export function getRandomData(row: number, count: number, idx?: number, items = 50) {
    const width = LAYOUT.w / count;
    const height = 200;

    if (data[row] && idx !== undefined) {
        return data[row][idx];
    }

    const temp: { backgroundImage: string; title: string; index: number }[] = [];
    for (let index = 0; index < items; index++) {
        temp.push({
            index,
            backgroundImage: `https://placekitten.com/${width}/${height + index}`,
            title: `${kittyNames[interval()]} ${kittyNames[interval()]} ${kittyNames[interval()]}`,
        });
    }

    data[row] = temp;

    return temp;
}

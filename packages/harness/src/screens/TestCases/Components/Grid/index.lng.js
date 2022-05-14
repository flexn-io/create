import { Lightning } from '@lightningjs/sdk';
import { Row } from '@flexn/sdk';

const kittyNames = ['Abby', 'Angel', 'Annie', 'Baby', 'Bailey', 'Bandit'];

function interval(min = 0, max = kittyNames.length - 1) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateData(width, height, items = 30) {
    const temp = [];

    for (let index = 0; index < items; index++) {
        temp.push({
            index,
            backgroundImage: `https://placekitten.com/${width + index}/${height + index}`,
            title: `${kittyNames[interval()]} ${kittyNames[interval()]} ${kittyNames[interval()]}`,
        });
    }

    return temp;
}

export default class Press extends Lightning.Component {
    static _template() {
        const data = generateData(400, 250);

        return {
            w: 1920,
            h: 1080,
            x: 50,
            y: 1080 / 2,
            Row: {
                type: Row,
                data,
                itemSpacing: 30,
                card: {
                    w: 250,
                    h: 250,
                },
                focusOptions: {
                    animatorOptions: {
                        type: 'scale_with_border',
                        scale: 1.2,
                        borderColor: 0xff008080,
                        borderRadius: 4,
                        borderWidth: 6,
                    },
                },
                signals: {
                    onFocus: '_onFocus',
                    onBlur: '_onBlur',
                    onPress: '_onPress',
                },
            },
        };
    }

    _onFocus(_item) {
        // TODO: implementation
    }

    _onBlur(_item) {
        // TODO: implementation
    }

    _onPress(_item) {
        // TODO: implementation
    }

    _getFocused() {
        return this.tag('Row');
    }
}

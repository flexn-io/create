import React from 'react';
import { Row } from '@flexn/sdk';
import Screen from '../../../../components/Screen';

const kittyNames = ['Abby', 'Angel', 'Annie', 'Baby', 'Bailey', 'Bandit'];

function interval(min = 0, max = kittyNames.length - 1) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateData(width, height, items = 30) {
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

const RowTest = () => {
    const data = [...generateData(400, 250, 10)];

    return (
        <Screen>
            <Row
                items={data}
                itemsInViewport={5}
                style={{ borderWidth: 1, borderColor: 'yellow', height: 400, marginLeft: 0 }}
                itemSpacing={30}
                itemDimensions={{ height: 250 }}
            />
        </Screen>
    );
};

export default RowTest;

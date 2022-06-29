import React from 'react';
import { List, Pressable, View } from '@flexn/sdk';
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

const ListTest = () => {
    const data = [...Array(5).keys()].map(() => {
        return {
            rowTitle: kittyNames[interval()],
            items: generateData(400, 250, 100),
            itemsInViewport: interval(3, 8),
        };
    });

    return (
        <Screen>
            <Pressable  style={{height: 200, width: 500, borderColor: 'red', borderWidth: 1}} />
            <View>
                <List
                    items={data}
                    itemsInViewport={5}
                    itemSpacing={30}
                    itemDimensions={{ height: 250 }}
                    rowHeight={400}
                    titleStyle={styles.titleStyle}
                    cardStyle={styles.cardStyle}
                    focusOptions={{ forbiddenFocusDirections: ['right'] }}
                    style={{height: 600}}
                />
            </View>
            <Pressable  style={{height: 200, width: 500, borderColor: 'red', borderWidth: 1}} />
        </Screen>
    );
};

const styles = {
    titleStyle: {
        fontSize: 36,
        color: 'white',
    },
    cardStyle: {
        color: 'white',
    },
    otherStyle: {},
};

export default ListTest;

import React from 'react';
import { Grid, View } from '@flexn/sdk';
import Screen from '../../../../components/Screen';

function generateData(width, height, items = 30) {
    const temp = [];
    for (let index = 0; index < items; index++) {
        temp.push({
            index,
            backgroundImage: `https://placekitten.com/${width + index}/${height + index}`,
            // title: `${kittyNames[interval()]} ${kittyNames[interval()]} ${kittyNames[interval()]}`,
        });
    }

    return temp;
}

const GridTest = () => {
    const data = generateData(400, 250);

    return (
        <Screen
            style={
                {
                    // flex: 1,
                }
            }
            debugName="GridTest"
        >
            <View style={{ top: 0, left: 0 }}>
                <Grid
                    items={data}
                    itemsInViewport={5}
                    style={{ borderWidth: 1, borderColor: 'yellow' }}
                    itemSpacing={30}
                />
            </View>
        </Screen>
    );
};

export default GridTest;

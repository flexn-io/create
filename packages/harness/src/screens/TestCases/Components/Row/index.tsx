import React from 'react';
import { Dimensions } from 'react-native';
import { Row, Grid, View, ScrollView } from '@flexn/sdk';
import Screen from '../../../../components/Screen';

const { height } = Dimensions.get('screen');


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

    const dataGrid = [...generateData(400, 250, 15)];
    console.log({ height });
    return (
        <Screen>
            <View style={{ height }}>
                {/* <ScrollView contentContainerStyle={{ height: height + 600 }} nestedScrollEnabled> */}
                <ScrollView>
                    <View style={{ marginTop: 200 }}>
                        <Row
                            items={data}
                            itemsInViewport={5}
                            style={{ height: 500, marginLeft: 0 }}
                            itemSpacing={30}
                            itemDimensions={{ height: 400 }}
                        />
                    </View>

                    {/* <View style={{ top: 200 }}>
                        <Row
                            items={data}
                            itemsInViewport={5}
                            style={{ height: 500, marginLeft: 0 }}
                            itemSpacing={30}
                            itemDimensions={{ height: 400 }}
                        />
                    </View> */}

                    <View style={{ marginTop: 200 }}>
                        {/* <PosterCard
                            src={{ uri: `https://placekitten.com/500/500` }}
                            style={{ width: 500, height: 500, marginHorizontal: 15 }}
                        /> */}
                        <Grid items={dataGrid} itemsInViewport={5} itemSpacing={30} itemDimensions={{ height: 200 }} style={{ height: 600 }} />
                    </View>
                </ScrollView>
            </View>

        </Screen>
    );
};

export default RowTest;

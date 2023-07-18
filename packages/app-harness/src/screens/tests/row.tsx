import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, FlashList, Pressable, Image, CreateListRenderItemInfo } from '@flexn/create';
import Screen from './../screen';
import { Ratio } from '../../utils';

const kittyNames = ['Abby', 'Angel', 'Annie', 'Baby', 'Bailey', 'Bandit'];

function interval(min = 0, max = kittyNames.length - 1) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateData(width: number, height: number, items = 30) {
    const temp: any = [];
    for (let index = 0; index < items; index++) {
        temp.push({
            index,
            backgroundImage: `https://placekitten.com/${width}/${height}`,
            title: `${kittyNames[interval()]} ${kittyNames[interval()]} ${kittyNames[interval()]}`,
        });
    }

    return temp;
}

const Row = () => {
    const [data] = useState(generateData(200, 200, 20));

    const rowRenderer = ({ item, focusRepeatContext }: CreateListRenderItemInfo<any>) => {
        return (
            <Pressable
                style={styles.packshot}
                focusRepeatContext={focusRepeatContext}
                focusOptions={{
                    animator: {
                        type: 'border',
                        focus: {
                            borderColor: 'blue',
                            borderWidth: 5,
                        },
                    },
                }}
            >
                <Image source={{ uri: item.backgroundImage }} style={styles.image} />
            </Pressable>
        );
    };

    return (
        <Screen style={{ backgroundColor: '#222222' }}>
            {/* <ScrollView> */}
            <View style={{ top: Ratio(200), width: '100%', left: 50 }}>
                <FlashList
                    data={data}
                    renderItem={rowRenderer}
                    horizontal
                    type="row"
                    estimatedItemSize={Ratio(200)}
                    style={{ height: Ratio(300) }}
                    focusOptions={{
                        autoLayoutScaleAnimation: true,
                        autoLayoutSize: 50,
                    }}
                />
            </View>
            {/* </ScrollView> */}
        </Screen>
    );
};

const styles = StyleSheet.create({
    packshot: {
        width: Ratio(200),
        height: Ratio(200),
        // borderColor: 'red',
        // borderWidth: 1,
        marginHorizontal: Ratio(15),
        // marginVertical: Ratio(50),
        // borderWidth: 2,
        // top: 100,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default Row;

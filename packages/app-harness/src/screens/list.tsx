import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, FlashList, Pressable, Image, ScrollView, CreateListRenderItemInfo } from '@flexn/create';
import Screen from './screen';
import { Ratio } from '../utils';

const border = {
    type: 'border',
    focus: {
        borderWidth: Ratio(8),
        borderColor: 'blue',
    },
    blur: {
        borderWidth: Ratio(4),
        borderColor: '#FFFFFF',
    },
};

const kittyNames = ['Abby', 'Angel', 'Annie', 'Baby', 'Bailey', 'Bandit'];

function interval(min = 0, max = kittyNames.length - 1) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateData(width: number, height: number, items = 30) {
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

const Row = () => {
    const [list] = useState(Array(12).fill(generateData(Ratio(200), Ratio(200), 15)));

    const rowRenderer = ({ item, focusRepeatContext }: CreateListRenderItemInfo<any>) => {
        return (
            <Pressable
                style={styles.packshot}
                focusRepeatContext={focusRepeatContext}
                focusOptions={{
                    animator: {
                        type: 'border',
                        focus: {
                            borderWidth: Ratio(8),
                            borderColor: 'blue',
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
            <ScrollView>
                <View style={{ top: 20, flex: 1, paddingBottom: 20 }}>
                    {list.map((listData, index) => (
                        <FlashList
                            key={index}
                            data={listData}
                            renderItem={rowRenderer}
                            horizontal
                            type="row"
                            estimatedItemSize={Ratio(200)}
                            style={{ flex: 1, marginVertical: Ratio(10) }}
                        />
                    ))}
                </View>
            </ScrollView>
        </Screen>
    );
};

const styles = StyleSheet.create({
    packshot: {
        width: Ratio(200),
        height: Ratio(200),
        // borderColor: 'red',
        // borderWidth: 1,
        margin: Ratio(5),
        // borderWidth: 2,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default Row;

import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView, View, FlashList, Pressable, Image, CreateListRenderItemInfo } from '@flexn/sdk';
import Screen from './screen';

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

const Row = () => {
    const [data] = useState(generateData(200, 200, 200));

    const rowRenderer = ({ item, focusRepeatContext }: CreateListRenderItemInfo<any>) => {
        return (
            <Pressable style={styles.packshot} focusRepeatContext={focusRepeatContext}>
                <Image source={{ uri: item.backgroundImage }} style={styles.image} />
            </Pressable>
        );
    };

    return (
        <Screen style={{ backgroundColor: '#222222' }}>
            <ScrollView>
                <View style={{ top: 200 }}>
                    <FlashList data={data} renderItem={rowRenderer} isHorizontal type="row" />
                </View>
            </ScrollView>
        </Screen>
    );
};

const styles = StyleSheet.create({
    packshot: {
        width: 200,
        height: 200,
        // borderColor: 'red',
        // borderWidth: 1,
        margin: 5,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default Row;

import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, FlashList, Image, CreateListRenderItemInfo } from '@flexn/create';
import Pressable from '../../components/Pressable';
import Screen from './../screen';
import { Ratio } from '../../utils';
import { NavigationProps } from '../../navigation';

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

const Grid = ({ route }: NavigationProps) => {
    const [data] = useState(generateData(200, 200, 200));

    const rowRenderer = ({ item, focusRepeatContext, index }: CreateListRenderItemInfo<any>) => {
        return (
            <Pressable
                testID={`harness-G1-${index}-pressable`}
                style={styles.packshot}
                focusRepeatContext={focusRepeatContext}
                focusOptions={{
                    animator: {
                        type: 'scale',
                        focus: {
                            scale: 1.4,
                        },
                    },
                }}
            >
                <Image source={{ uri: item.backgroundImage }} style={styles.image} />
            </Pressable>
        );
    };

    return (
        <Screen style={{ backgroundColor: '#222222' }} route={route}>
            <View style={{ top: Ratio(20), flex: 1 }}>
                <FlashList
                    data={data}
                    renderItem={rowRenderer}
                    horizontal={false}
                    numColumns={5}
                    type="grid"
                    estimatedItemSize={Ratio(200)}
                    style={{ flex: 1 }}
                />
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    packshot: {
        width: Ratio(200),
        height: Ratio(200),
        marginHorizontal: 5,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

Grid.id = 'G1';
Grid.platform = ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'];
Grid.route = 'Grid';
Grid.title = 'Grid';
Grid.description = 'Grid';

export default Grid;

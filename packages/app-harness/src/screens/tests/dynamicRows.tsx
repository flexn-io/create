import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, FlashList, Image, CreateListRenderItemInfo } from '@flexn/create';
import type { NavigationProps } from '../../navigation';
import Screen from './../screen';
import { Ratio } from '../../utils';
import Pressable from '../../components/Pressable';

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

const DynamicRows = ({ route }: NavigationProps) => {
    const [data] = useState(generateData(200, 200, 5));
    const [data2, setData2] = useState(generateData(200, 200, 5));

    const rowRenderer = ({ item, focusRepeatContext, index }: CreateListRenderItemInfo<any>) => {
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
                onPress={() => {
                    setData2(generateData(interval(201, 210), interval(201, 210), interval(5, 10)));
                }}
                testID={`DR1-0-${index}`}
            >
                <Image source={{ uri: item.backgroundImage }} style={styles.image} />
            </Pressable>
        );
    };

    const rowRenderer2 = ({ item, focusRepeatContext, index }: CreateListRenderItemInfo<any>) => {
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
                testID={`DR1-1-${index}`}
            >
                <Image source={{ uri: item.backgroundImage }} style={styles.image} />
            </Pressable>
        );
    };

    return (
        <Screen style={{ backgroundColor: '#222222' }} route={route}>
            <View style={{ top: Ratio(50), width: '100%', left: 50 }}>
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
            <View style={{ width: '100%', left: 50 }}>
                <FlashList
                    data={data2}
                    renderItem={rowRenderer2}
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
        </Screen>
    );
};

const styles = StyleSheet.create({
    packshot: {
        width: Ratio(200),
        height: Ratio(200),
        marginHorizontal: Ratio(15),
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

DynamicRows.id = 'DR1';
DynamicRows.platform = ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'];
DynamicRows.route = 'DynamicRows';
DynamicRows.title = 'Dynamic rows';
DynamicRows.description =
    'Pressing on any of first row items should change data in second row and navigating to second row focus all the time should start from first item after data is changed.';

export default DynamicRows;

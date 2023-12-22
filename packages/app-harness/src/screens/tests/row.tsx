import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, FlashList, Image, CreateListRenderItemInfo } from '@flexn/create';
import Screen from './../screen';
import { Ratio } from '../../utils';
import { NavigationProps } from '../../navigation';
import Pressable from '../../components/Pressable';

export const kittyNames = ['Abby', 'Angel', 'Annie', 'Baby', 'Bailey', 'Bandit'];

export function interval(min = 0, max = kittyNames.length - 1) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function generateData(width: number, height: number, items = 30) {
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

const Row = ({ route }: NavigationProps) => {
    const [data] = useState(generateData(200, 200, 20));

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
                testID={`R1-${index}`}
            >
                <Image source={{ uri: item.backgroundImage }} style={styles.image} />
            </Pressable>
        );
    };

    return (
        <Screen style={{ backgroundColor: '#222222' }} route={route}>
            <View style={{ width: '100%', left: Ratio(20) }}>
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

Row.id = 'R1';
Row.platform = ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'];
Row.route = 'Row';
Row.title = 'Row';
Row.description = 'Row component expected to scroll left and right with no focus looses and delays.';

export default Row;

import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, FlashList, Image, ScrollView, CreateListRenderItemInfo } from '@flexn/create';
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
            backgroundImage: `https://placekitten.com/${width + index}/${height}`,
            title: `${kittyNames[interval()]} ${kittyNames[interval()]} ${kittyNames[interval()]}`,
        });
    }

    return temp;
}

const List = ({ route }: NavigationProps) => {
    const [list] = useState(Array(10).fill(generateData(Ratio(200), Ratio(200), 10)));

    const rowRenderer = ({
        item,
        focusRepeatContext,
        index,
        listIndex,
    }: CreateListRenderItemInfo<any> & { listIndex: number }) => {
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
                testID={`L1-${listIndex}-${index}`}
            >
                <Image source={{ uri: item.backgroundImage }} style={styles.image} />
            </Pressable>
        );
    };

    return (
        <Screen style={{ backgroundColor: '#222222' }} route={route}>
            <ScrollView>
                <View style={{ top: 20, flex: 1, paddingBottom: 20 }}>
                    {list.map((listData, index) => (
                        <FlashList
                            key={index}
                            data={listData}
                            renderItem={(props) => {
                                return rowRenderer({ ...props, listIndex: index });
                            }}
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

List.id = 'L1';
List.platform = ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'];
List.route = 'List';
List.title = 'List';
List.description =
    "List component where focus should be predictable and every row has to remember it's position. Also any focused item should never be hidden.";

export default List;

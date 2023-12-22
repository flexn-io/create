import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, FlashList, Image, CreateListRenderItemInfo, ScrollView } from '@flexn/create';
import Screen from './../screen';
import { Ratio } from '../../utils';
import { NavigationProps } from '../../navigation';
import { Button } from '../../components/Button';
import Pressable from '../../components/Pressable';
import { generateData } from './row';

const DifferentOffsets = ({ route }: NavigationProps) => {
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
            <ScrollView>
                <Button testID="SF1-B1" title="B1" style={{ marginTop: 150 }}/>
                <View  style={{position: 'absolute', width: '100%', height: 2, backgroundColor: 'red', top: 200}} />
                <View  style={{position: 'absolute', width: '100%', height: 2, backgroundColor: 'green', top: 230}} />
                <View  style={{position: 'absolute', width: '100%', height: 2, backgroundColor: 'blue', top: 260}} />
                <View  style={{position: 'absolute', width: '100%', height: 2, backgroundColor: 'yellow', top: 290}} />
                <View  style={{position: 'absolute', width: '100%', height: 2, backgroundColor: 'orange', top: 320}} />
                <View style={{ top: Ratio(20), flex: 1, flexDirection: 'row', marginTop: 120 }}>
                    <Button testID="SF1-B1" title="B1" style={{ top: 50 }} focusOptions={{verticalViewportOffset: 250}} />
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
                            verticalViewportOffset: 70
                        }}
                    />
                </View>
                <Button testID="SF1-B1" title="B1" style={{ marginTop: 1200 }}/>
            </ScrollView>
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

DifferentOffsets.id = 'DO1';
DifferentOffsets.platform = ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'];
DifferentOffsets.route = 'DifferentOffsets';
DifferentOffsets.title = 'Different Offsets';
DifferentOffsets.description = 'Different Offsets';

export default DifferentOffsets;

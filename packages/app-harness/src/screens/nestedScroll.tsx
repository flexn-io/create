import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { View, ScrollView, Pressable } from '@flexn/create';
import { getScaledValue } from '@rnv/renative';
import Screen from './screen';
import { Ratio } from '../utils';

const NestedScroll = () => {
    const [verticalItems] = useState(Array(12).fill(0));
    const [horizontalItems] = useState(Array(20).fill(0));

    return (
        <Screen style={{ backgroundColor: '#222222' }}>
            {/* <View style={{ top: 200, borderWidth: 1, borderColor: 'yellow', paddingBottom: 200 }}> */}
            <View style={{ marginTop: 10, marginLeft: 20 }}>
                <ScrollView style={{ width: '100%' }}>
                    {verticalItems.map((item, index) => (
                        <View key={index}>
                            <Pressable style={styles.itemVertical}>
                                <Text style={styles.text}>{index + 1}</Text>
                            </Pressable>
                            {index % 2 === 0 && (
                                <View style={{ position: 'absolute', marginLeft: 200, marginTop: 20 * index }}>
                                    <ScrollView horizontal>
                                        {horizontalItems.map((item, index) => (
                                            <Pressable style={styles.itemHorizontal} key={index}>
                                                <Text style={styles.text}>{index + 1}</Text>
                                            </Pressable>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    itemHorizontal: {
        width: 150,
        height: 150,
        borderColor: 'red',
        borderWidth: 1,
        marginVertical: 10,
        marginHorizontal: 10,
        justifyContent: 'center',
    },
    itemVertical: {
        width: 150,
        height: 150,
        borderColor: 'red',
        borderWidth: 1,
        marginVertical: 10,
        justifyContent: 'center',
    },
    text: {
        color: 'white',
        fontSize: 30,
        textAlign: 'center',
    },

    button: {
        marginHorizontal: getScaledValue(20),
        borderWidth: getScaledValue(2),
        borderRadius: getScaledValue(25),
        borderColor: '#62DBFB',
        height: getScaledValue(50),
        width: Ratio(500),
        marginTop: getScaledValue(20),
    },
    buttonTextStyle: {
        color: '#ffffff',
        fontSize: Ratio(20),
    },
    packshot: {
        width: Ratio(200),
        height: Ratio(200),
        margin: Ratio(5),
    },
    image: {
        width: '100%',
        height: '100%',
    },
    button1Pos: {},
    button2Pos: {
        left: Ratio(400),
    },
});

export default NestedScroll;

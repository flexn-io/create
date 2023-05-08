import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { View, ScrollView, Pressable } from '@flexn/sdk';
import { getScaledValue } from '@rnv/renative';
import Screen from './screen';
import { Ratio } from '../utils';

const DynamicState = () => {
    const [arrayItems] = useState(Array(20).fill(0));

    return (
        <Screen style={{ backgroundColor: '#222222' }}>
            {/* <View style={{ top: 200, borderWidth: 1, borderColor: 'yellow', paddingBottom: 200 }}> */}
            <View style={{ marginTop: 300 }}>
                <ScrollView>
                    {arrayItems.map((item, index) => (
                        <Pressable style={styles.item}>
                            <Text style={styles.text}>{index + 1}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    item: {
        width: '80%',
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

export default DynamicState;

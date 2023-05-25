//@ts-nocheck
import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView, View } from '@flexn/create';
import { getScaledValue } from '@rnv/renative';
import Screen from './screen';
import { Button } from '../components/Button';
import { Ratio } from '../utils';

const DirectionalFocus = () => {
    return (
        <Screen style={{ backgroundColor: '#222222' }}>
            <ScrollView>
                <View style={{ top: Ratio(20) }}>
                    <Button
                        style={{ ...styles.button, ...styles.button1 }}
                        title="Button1: -> Button2"
                        textStyle={styles.buttonTextStyle}
                    />
                    <Button
                        style={{ ...styles.button, ...styles.button2 }}
                        title="Button2: -> Button3"
                        textStyle={styles.buttonTextStyle}
                    />
                    <Button
                        style={{ ...styles.button, ...styles.button3 }}
                        title="Button3: -> Button4"
                        textStyle={styles.buttonTextStyle}
                    />
                    <Button
                        style={{ ...styles.button, ...styles.button4 }}
                        title="Button4: -> Button5"
                        textStyle={styles.buttonTextStyle}
                    />
                    <Button
                        style={{ ...styles.button, ...styles.button5 }}
                        title="Button5: -> Button6"
                        textStyle={styles.buttonTextStyle}
                    />
                </View>
            </ScrollView>
        </Screen>
    );
};

const styles = StyleSheet.create({
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
    button1: {},
    button2: {
        left: 400,
    },
    button3: {
        left: 1000,
    },
    button4: {
        top: 100,
        left: 250,
    },
    button5: {
        top: 300,
        left: 500,
    },
    button6: {},
    button7: {},
    button8: {},
    button9: {},
    button10: {},
});

export default DirectionalFocus;

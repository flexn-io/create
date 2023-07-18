import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@flexn/create';
import { getScaledValue } from '@rnv/renative';
import Screen from '../screen';
import { Button } from '../../components/Button';
import { Ratio } from '../../utils';

const ViewGroup = () => {
    return (
        <Screen style={{ backgroundColor: '#222222' }}>
            <View
                style={{ top: Ratio(20), flex: 1 }}
                focusOptions={{ nextFocusDown: 'test-group-btn2', focusKey: 'test-group', group: 'test-group' }}
            >
                <Button
                    focusOptions={{ focusKey: 'test-group-btn' }}
                    style={{ ...styles.button, ...styles.button1 }}
                    title="Button1: -> Button2"
                    textStyle={styles.buttonTextStyle}
                />
            </View>
            <View
                style={{ top: Ratio(20), flex: 1 }}
                focusOptions={{ nextFocusUp: 'test-group-btn', group: 'test-group2' }}
            >
                <Button
                    focusOptions={{ focusKey: 'test-group-btn2' }}
                    style={{ ...styles.button, ...styles.button2 }}
                    title="Button1: -> Button2"
                    textStyle={styles.buttonTextStyle}
                />
            </View>
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
    packshot: {
        width: Ratio(150),
        height: Ratio(150),
        // borderColor: 'red',
        // borderWidth: 1,
        margin: 5,
        // borderWidth: 2,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    buttonTextStyle: {
        color: '#ffffff',
        fontSize: Ratio(20),
    },
    button1: {},
    button2: {
        left: Ratio(400),
    },
    button3: {
        left: Ratio(1000),
    },
    button4: {
        top: Ratio(100),
        left: Ratio(250),
    },
    button5: {
        top: Ratio(300),
        left: Ratio(500),
    },
    button6: {},
    button7: {},
    button8: {},
    button9: {},
    button10: {},
});

export default ViewGroup;

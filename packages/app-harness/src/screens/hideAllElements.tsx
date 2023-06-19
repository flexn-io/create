import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@flexn/create';
import { getScaledValue } from '@rnv/renative';
import Screen from './screen';
import { Button } from '../components/Button';
import { Ratio } from '../utils';

const HideAllElements = () => {
    const [elementsVisible, setElementsVisible] = useState(true);

    const onButton1Press = () => {
        setElementsVisible(false);
        setTimeout(() => {
            setElementsVisible(true);
        }, 2000);
    };

    return (
        <Screen style={{ backgroundColor: '#222222' }}>
            <View style={{ top: Ratio(20) }}>
                {elementsVisible && (
                    <View>
                        <Button
                            style={{ ...styles.button }}
                            title="Press this button to hide all elements for 2 seconds"
                            textStyle={styles.buttonTextStyle}
                            onPress={onButton1Press}
                        />
                        <Button style={{ ...styles.button }} title="Button2" textStyle={styles.buttonTextStyle} />
                        <Button style={{ ...styles.button }} title="Button3" textStyle={styles.buttonTextStyle} />
                        <Button style={{ ...styles.button }} title="Button4" textStyle={styles.buttonTextStyle} />
                    </View>
                )}
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

export default HideAllElements;

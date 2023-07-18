import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView, View } from '@flexn/create';
import { getScaledValue } from '@rnv/renative';
import Screen from '../screen';
import { Button } from '../../components/Button';
import { interval, Ratio } from '../../utils';

const DynamicState = () => {
    const [button1Visible] = useState(true);
    const [button2Visible, setButton2Visible] = useState(true);
    const [button3Position, setButton3Position] = useState({ top: Ratio(100), left: Ratio(100) });

    const onButton1Press = () => {
        setButton2Visible((prev) => !prev);
    };

    const onButton2Press = () => {
        setButton3Position({ left: interval(100, 300), top: interval(200, 400) });
    };

    return (
        <Screen style={{ backgroundColor: '#222222' }}>
            <ScrollView>
                <View style={{ top: Ratio(20) }}>
                    {button1Visible && (
                        <Button
                            style={{ ...styles.button }}
                            title="Button1: Toggle Button 2 visibility"
                            textStyle={styles.buttonTextStyle}
                            onPress={onButton1Press}
                        />
                    )}
                    {button2Visible && (
                        <Button
                            style={{ ...styles.button, ...styles.button2Pos }}
                            title="Button2: Change button 3 position"
                            textStyle={styles.buttonTextStyle}
                            onPress={onButton2Press}
                        />
                    )}
                    <Button style={{ ...styles.button }} title="Button3" textStyle={styles.buttonTextStyle} />
                    <Button
                        style={{ ...styles.button, ...button3Position }}
                        title="Button4"
                        textStyle={styles.buttonTextStyle}
                    />
                    <Button
                        style={{ ...styles.button, marginTop: 600 }}
                        title="Button5"
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

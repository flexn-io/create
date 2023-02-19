import React, { useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { ScrollView, View, withParentContextMapper } from '@flexn/sdk';
import { getScaledValue } from '@rnv/renative';
import Screen from './screen';
import { Button } from '../components/Button';
import { Ratio } from '../utils';

const AnimatedView = withParentContextMapper(Animated.createAnimatedComponent(View));

const DynamicState = () => {
    const moveAnimation = useRef(new Animated.Value(0)).current;

    const onButton1Press = () => {
        console.log('press');
        Animated.timing(moveAnimation, {
            toValue: 400,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    };

    return (
        <Screen style={{ backgroundColor: '#222222' }}>
            <ScrollView>
                <View style={{ top: Ratio(20) }}>
                    <Button
                        style={{ ...styles.button }}
                        title="Animate button 2"
                        textStyle={styles.buttonTextStyle}
                        onPress={onButton1Press}
                    />
                    <AnimatedView
                        style={{
                            left: moveAnimation,
                        }}
                    >
                        <Button style={{ ...styles.button }} title="Button2" textStyle={styles.buttonTextStyle} />
                    </AnimatedView>
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

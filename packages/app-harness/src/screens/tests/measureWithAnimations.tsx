import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView, View, withParentContextMapper, Animated } from '@flexn/create';
import { getScaledValue } from '@rnv/renative';
import Screen from '../screen';
import { Button } from '../../components/Button';
import { Ratio } from '../../utils';

const AnimatedView = withParentContextMapper(Animated.createAnimatedComponent(View));

const MeasureWithAnimations = () => {
    const moveAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(moveAnimation, {
            toValue: 400,
            duration: 5000,
            useNativeDriver: false,
        }).start();
    }, []);

    const onButton1Press = () => {
        Animated.timing(moveAnimation, {
            toValue: 0,
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
                            transform: [{ translateX: moveAnimation }],
                            // left: moveAnimation,
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

MeasureWithAnimations.id = 'MWA1';
MeasureWithAnimations.platform = ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'];
MeasureWithAnimations.route = 'MeasureWithAnimations';
MeasureWithAnimations.title = 'MeasureWithAnimations';
MeasureWithAnimations.description = '';

export default MeasureWithAnimations;

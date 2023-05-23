import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, Pressable } from '@flexn/create';
import Screen from './screen';
import { Ratio } from '../utils';

const scale = {
    type: 'scale',
    focus: {
        scale: 1.2,
    },
    blur: {
        scale: 1,
    },
    // duration: 150,
};

const border = {
    type: 'border',
    focus: {
        borderWidth: 5,
        borderColor: 'yellow',
    },
    blur: {
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },
};

const bgColor = {
    type: 'background',
    focus: {
        backgroundColor: '#FF0000',
    },
    blur: {
        backgroundColor: '#FFFFFF',
    },
};
const scaleBorder = {
    type: 'scale_with_border',
    focus: {
        scale: 1.5,
        borderWidth: 3,
        borderColor: 'yellow',
    },
    blur: {
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },
};

const PressableAnimations = () => {
    return (
        <Screen style={{ backgroundColor: '#222222' }}>
            <View style={{ left: 50, top: 50 }}>
                <Pressable style={styles.animation1} focusOptions={{ animatorOptions: scale }}>
                    <Text>Animation scale</Text>
                </Pressable>
                <Pressable style={styles.animation2} focusOptions={{ animatorOptions: bgColor }}>
                    <Text>Animation bg color</Text>
                </Pressable>
                <Pressable style={styles.animation2} focusOptions={{ animatorOptions: scaleBorder }}>
                    <Text>Animation scale border</Text>
                </Pressable>
                <Pressable style={styles.animation2} focusOptions={{ animatorOptions: border }}>
                    <Text>Animation border</Text>
                </Pressable>
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    animation1: {
        width: Ratio(200),
        height: Ratio(200),
        borderColor: 'red',
        borderWidth: 5,
        margin: Ratio(15),
    },
    animation2: {
        width: Ratio(200),
        height: Ratio(200),
        // borderColor: 'red',
        borderWidth: 5,
        margin: Ratio(15),
    },
});

export default PressableAnimations;

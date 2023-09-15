import { Text, FocusContext, PressableProps } from '@flexn/create';
import React from 'react';
import { StyleSheet } from 'react-native';
import { getScaledValue } from '@rnv/renative';
import Pressable from '../Pressable';
import { Ratio } from '../../utils';

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        opacity: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: getScaledValue(20),
        borderWidth: getScaledValue(2),
        borderRadius: getScaledValue(25),
        borderColor: '#62DBFB',
        height: getScaledValue(50),
        width: Ratio(500),
        marginTop: getScaledValue(20),
    },
    textStyle: {
        color: '#ffffff',
        fontSize: Ratio(20),
    },
    icon: {
        marginRight: getScaledValue(20),
    },
});

interface ButtonProps {
    activeOpacity?: number;
    children?: React.ReactNode;
    title?: string;
    style?: any;
    textStyle?: any;
    testID?: string;
    onPress?: any;
    focusContext?: FocusContext;
}

const Button = ({
    title,
    style,
    textStyle,
    testID,
    onPress,
    focusContext,
    focusOptions,
}: ButtonProps & PressableProps) => (
    <Pressable
        testID={testID}
        style={[styles.button, style]}
        onPress={onPress}
        focusContext={focusContext}
        focusOptions={focusOptions}
    >
        {title ? (
            <Text style={[styles.textStyle, textStyle]} accessible={false}>
                {title}
            </Text>
        ) : null}
    </Pressable>
);

export { Button };

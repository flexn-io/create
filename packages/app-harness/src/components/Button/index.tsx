import { Pressable, Text, FocusContext } from '@flexn/create';
import React from 'react';
import { StyleSheet } from 'react-native';
import { getScaledValue } from '@rnv/renative';

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        opacity: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
    accessible?: boolean;
    accessibilityLabel?: string;
    onPress?: any;
    focusContext?: FocusContext;
    focusOptions?: any;
}

const Button = ({
    title,
    style,
    textStyle,
    testID,
    accessible,
    accessibilityLabel,
    onPress,
    focusContext,
    focusOptions,
}: ButtonProps) => (
    <Pressable
        style={[styles.button, style]}
        onPress={onPress}
        testID={testID}
        accessible={accessible}
        accessibilityLabel={accessibilityLabel}
        focusContext={focusContext}
        focusOptions={focusOptions}
    >
        {title ? (
            <Text style={textStyle} accessible={false}>
                {title}
            </Text>
        ) : null}
    </Pressable>
);

export { Button };

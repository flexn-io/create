import { Pressable, Text, Icon, FocusContext } from '@flexn/create';
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
    iconFont?:
        | 'fontAwesome'
        | 'feather'
        | 'antDesign'
        | 'entypo'
        | 'evilIcons'
        | 'foundation'
        | 'ionicons'
        | 'materialIcons'
        | 'octicons'
        | 'simpleLineIcons'
        | 'zocial';
    iconName?: string;
    iconColor?: string;
    iconSize?: number;
    style?: any;
    textStyle?: any;
    testID?: string;
    accessible?: boolean;
    accessibilityLabel?: string;
    onPress?: any;
    focusContext?: FocusContext;
}

const Button = ({
    title,
    iconFont,
    iconName,
    iconColor,
    iconSize,
    style,
    textStyle,
    testID,
    accessible,
    accessibilityLabel,
    onPress,
    activeOpacity,
    focusContext,
}: ButtonProps) => (
    <Pressable
        style={[styles.button, style]}
        onPress={onPress}
        activeOpacity={activeOpacity ?? 0.2}
        testID={testID}
        accessible={accessible}
        accessibilityLabel={accessibilityLabel}
        focusContext={focusContext}
    >
        {iconName ? (
            <Icon
                iconFont={iconFont || 'fontAwesome'}
                iconName={iconName}
                iconColor={iconColor || 'black'}
                size={iconSize || 10}
                style={[
                    styles.icon,
                    {
                        width: iconSize,
                        height: iconSize,
                        marginRight: title ? getScaledValue(20) : 0,
                    },
                ]}
            />
        ) : null}
        {title ? (
            <Text style={textStyle} accessible={false}>
                {title}
            </Text>
        ) : null}
    </Pressable>
);

export { Button };

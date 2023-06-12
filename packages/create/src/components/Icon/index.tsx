import React from 'react';
import { View, TouchableOpacity, ViewStyle, StyleProp, StyleSheet } from 'react-native';

const fontAwesome = require('react-native-vector-icons/FontAwesome').default;
const feather = require('react-native-vector-icons/Feather').default;
const antDesign = require('react-native-vector-icons/AntDesign').default;
const entypo = require('react-native-vector-icons/Entypo').default;
const evilIcons = require('react-native-vector-icons/EvilIcons').default;
const foundation = require('react-native-vector-icons/Foundation').default;
const ionicons = require('react-native-vector-icons/Ionicons').default;
const materialIcons = require('react-native-vector-icons/MaterialIcons').default;
const octicons = require('react-native-vector-icons/Octicons').default;
const simpleLineIcons = require('react-native-vector-icons/SimpleLineIcons').default;
const zocial = require('react-native-vector-icons/Zocial').default;

const IconMap = {
    fontAwesome,
    feather,
    antDesign,
    entypo,
    evilIcons,
    foundation,
    ionicons,
    materialIcons,
    octicons,
    simpleLineIcons,
    zocial,
} as const;

const IconComponent = ({
    iconFont,
    iconName,
    iconColor,
    onPress,
    style,
    testID,
    size,
}: {
    iconFont: keyof typeof IconMap;
    iconName: string;
    iconColor: string;
    testID?: string;
    size: number;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
}) => {
    const IC = IconMap[iconFont];
    const flattenStyle = { ...StyleSheet.flatten(style) };

    if (onPress) {
        return (
            <TouchableOpacity style={style} onPress={onPress} testID={testID}>
                <IC
                    style={{ color: iconColor }}
                    name={iconName}
                    size={size || flattenStyle?.width || flattenStyle?.height}
                />
            </TouchableOpacity>
        );
    }
    return (
        <View style={style} testID={testID}>
            <IC
                style={{ color: iconColor }}
                name={iconName}
                size={size || flattenStyle?.width || flattenStyle?.height}
            />
        </View>
    );
};

export default IconComponent;

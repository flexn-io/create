import React from 'react';
import { View } from 'react-native';
import type { ScreenProps } from '../../focusManager/types';

export default function Screen({ children, style }: ScreenProps) {
    return <View style={style}>{children}</View>;
}
 
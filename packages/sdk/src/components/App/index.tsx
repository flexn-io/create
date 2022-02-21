import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

export default function App({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
    return <View style={style}>{children}</View>;
}

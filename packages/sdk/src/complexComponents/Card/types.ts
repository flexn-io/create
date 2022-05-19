import React from 'react';
import {
    StyleProp,
    ViewStyle,
    ImageURISource,
} from 'react-native';

type ResizeMode = 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';

// export interface CardProps extends React.ComponentPropsWithRef<typeof Image> {
export interface CardProps {
    style: StyleProp<ViewStyle>,
    src: ImageURISource,
    onFocus?: (event: FocusEvent) => void,
    onPress?: (event: FocusEvent) => void,
    resizeMode: ResizeMode
};
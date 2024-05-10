import React from 'react';
import { View as RNView, ViewProps, ColorValue } from 'react-native';
import {
    AnimatorBackground,
    AnimatorBorder,
    AnimatorScale,
    AnimatorScaleWithBorder,
} from '..';

// AnimatorBackground | AnimatorBorder | AnimatorScale | AnimatorScaleWithBorder
interface Props extends ViewProps {
    animatorOptions?: {
        type:
            | AnimatorBackground['type']
            | AnimatorBorder['type']
            | AnimatorScale['type']
            | AnimatorScaleWithBorder['type'];
        focus:
            | AnimatorBackground['focus']
            | AnimatorBorder['focus']
            | AnimatorScale['focus']
            | AnimatorScaleWithBorder['focus'];
        blur: {
            borderWidth?: number;
            duration?: number;
            borderRadius?: number;
            borderColor?: ColorValue;
            backgroundColor?: ColorValue;
        };
        // style: ViewStyle;
    };
}

const View = React.forwardRef<RNView, Props>((props, ref) => (
    <RNView {...props} ref={ref} />
));

export default View;

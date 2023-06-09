import React from 'react';
import { View as RNView, ViewProps } from 'react-native';
import { AnimatorBackground, AnimatorBorder, AnimatorScale, AnimatorScaleWithBorder } from '..';

interface Props extends ViewProps {
    animatorOptions?: AnimatorBackground | AnimatorBorder | AnimatorScale | AnimatorScaleWithBorder;
}

const View = React.forwardRef<RNView, Props>((props, ref) => <RNView {...props} ref={ref} />);

export default View;

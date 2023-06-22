import React from 'react';
import { Platform, TouchableOpacity as RNTouchableOpacity } from 'react-native';
import type { TouchableOpacityProps } from '../../focusManager/types';
import Pressable from '../Pressable';

const TouchableOpacity = React.forwardRef<RNTouchableOpacity, TouchableOpacityProps>((props, ref) => {
    console.log('HERE222...');

    // if (!Platform.isTV) {
    //     return <RNTouchableOpacity {...props} ref={ref} />;
    // }

    return <Pressable {...props} ref={ref} focus={true} />;
});

TouchableOpacity.displayName = 'TouchableOpacity';

export default TouchableOpacity;

import React from 'react';
import { TouchableOpacity as RNTouchableOpacity } from 'react-native';
import { CoreManager } from '../..';
import type { TouchableOpacityProps } from '../../focusManager/types';
import Pressable from '../Pressable';

const TouchableOpacity = React.forwardRef<RNTouchableOpacity, TouchableOpacityProps>((props, ref) => {
    if (!CoreManager.isFocusManagerEnabled()) {
        return <RNTouchableOpacity {...props} ref={ref} />;
    }

    return <Pressable {...props} ref={ref} focus={true} />;
});

TouchableOpacity.displayName = 'TouchableOpacity';

export default TouchableOpacity;

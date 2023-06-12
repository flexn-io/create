import React from 'react';
import { TouchableOpacity as RNTouchableOpacity } from 'react-native';
import type { TouchableOpacityProps } from '../../focusManager/types';

const TouchableOpacity = React.forwardRef<RNTouchableOpacity, TouchableOpacityProps>((props, ref) => (
    <RNTouchableOpacity {...props} ref={ref} />
));

TouchableOpacity.displayName = 'TouchableOpacity';

export default TouchableOpacity;

import React from 'react';
import { TouchableOpacity as RNTouchableOpacity } from 'react-native';
import type { ViewProps } from '../../focusManager/types';

const TouchableOpacity = React.forwardRef<RNTouchableOpacity, ViewProps>(({ children, ...props }, ref) => (
    <RNTouchableOpacity {...props} ref={ref}>
        {children}
    </RNTouchableOpacity>
));

TouchableOpacity.displayName = 'TouchableOpacity';

export default TouchableOpacity;

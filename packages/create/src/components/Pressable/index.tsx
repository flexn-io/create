import React from 'react';
import { Pressable as RNPressable } from 'react-native';
import type { PressableProps } from '../../focusManager/types';

const Pressable = React.forwardRef<any, PressableProps>(({ children, ...props }, ref) => (
    <RNPressable {...props} ref={ref}>
        {children}
    </RNPressable>
));

Pressable.displayName = 'Pressable';

export default Pressable;

import React from 'react';
import { View as RNView } from 'react-native';
import Pressable from '../Pressable';
import type { ViewProps } from '../../focusManager/types';

const View = React.forwardRef<RNView, ViewProps>(({ children, ...props }, ref) => {
    return (
        <Pressable {...props} focus={false} ref={ref}>
            {children}
        </Pressable>
    );
});

View.displayName = 'View';

export default View;

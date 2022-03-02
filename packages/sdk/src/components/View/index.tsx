import React from 'react';
import { View as RNView } from 'react-native';
import type { ViewProps } from '../../focusManager/types';

const View = React.forwardRef<RNView, ViewProps>(({ children, ...props }, ref) => (
    <RNView {...props} ref={ref}>
        {children}
    </RNView>
));

View.displayName = 'View';

export default View;

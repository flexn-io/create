import React from 'react';
import Pressable from '../Pressable';
import type { ViewProps } from '../../focusManager/types';

const View = React.forwardRef<any, ViewProps>(({ children, parentContext, ...props }, ref) => {
    return (
        <Pressable parentContext={parentContext} {...props} focus={false} ref={ref}>
            {children}
        </Pressable>
    );
});

View.displayName = 'View';

export default View;

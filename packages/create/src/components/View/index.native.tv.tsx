import React from 'react';
import Pressable from '../Pressable';
import type { ViewProps } from '../../focusManager/types';
import ViewGroup from '../ViewGroup';

const View = React.forwardRef<any, ViewProps>(({ children, focusContext, focusOptions, ...props }, ref) => {
    if (focusOptions?.group) {
        return (
            <ViewGroup focusContext={focusContext} focusOptions={focusOptions} {...props} ref={ref}>
                {children}
            </ViewGroup>
        );
    }

    return (
        <Pressable focusContext={focusContext} {...props} focus={false} ref={ref}>
            {children}
        </Pressable>
    );
});

View.displayName = 'View';

export default View;

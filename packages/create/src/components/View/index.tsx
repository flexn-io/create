import React from 'react';
import { View as RNView } from 'react-native';
import Pressable from '../Pressable';
import type { ViewProps } from '../../focusManager/types';
import ViewGroup from '../ViewGroup';
import { CoreManager } from '../..';

const View = React.forwardRef<RNView, ViewProps>(
    ({ children, focusContext, focusOptions, ...props }, ref) => {
        if (!CoreManager.isFocusManagerEnabled()) {
            return (
                <RNView {...props} ref={ref}>
                    {children}
                </RNView>
            );
        }

        if (focusOptions?.group) {
            return (
                <ViewGroup
                    focusContext={focusContext}
                    focusOptions={{
                        ...focusOptions,
                        group: focusOptions.group,
                    }}
                    {...props}
                    ref={ref}
                >
                    {children}
                </ViewGroup>
            );
        }

        return (
            <Pressable
                focusContext={focusContext}
                {...props}
                focus={false}
                ref={ref}
            >
                {children}
            </Pressable>
        );
    }
);

View.displayName = 'View';

export default View;

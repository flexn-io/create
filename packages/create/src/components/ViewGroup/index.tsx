import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import type { ViewGroupProps } from '../../focusManager/types';
import useOnLayout from '../../hooks/useOnLayout';
import ViewGroupClass from '../../focusManager/model/viewGroup';
import useOnComponentLifeCycle from '../../hooks/useOnComponentLifeCycle';
import { CoreManager } from '../..';

const ViewGroup = React.forwardRef<View, ViewGroupProps>(
    ({ children, focusContext, focusOptions, style, ...props }, ref) => {
        if (!CoreManager.isFocusManagerEnabled()) {
            return (
                <View style={style} {...props} ref={ref}>
                    {children}
                </View>
            );
        }

        const [model] = useState(
            () =>
                new ViewGroupClass({
                    focusContext,
                    ...focusOptions,
                })
        );

        useOnComponentLifeCycle({ model });

        useEffect(() => {
            model.setGroup(focusOptions.group);
        }, [focusOptions.group]);

        const { onLayout } = useOnLayout(model);

        const childrenWithProps = React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, {
                    focusContext: model,
                });
            }

            return child;
        });

        return (
            <View style={style} {...props} ref={ref} onLayout={onLayout}>
                {childrenWithProps}
            </View>
        );
    }
);

ViewGroup.displayName = 'ViewGroup';

export default ViewGroup;

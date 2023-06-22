import React, { useState } from 'react';
import { View } from 'react-native';
import type { ViewGroupProps } from '../../focusManager/types';
import useOnLayout from '../../hooks/useOnLayout';
import ViewGroupClass from '../../focusManager/model/viewGroup';
import useOnComponentLifeCycle from '../../hooks/useOnComponentLifeCycle';

const ViewGroup = React.forwardRef<View, ViewGroupProps>(
    ({ children, focusContext, focusOptions, style, ...props }, ref) => {
        const [model] = useState<any>(
            () =>
                new ViewGroupClass({
                    focusContext,
                    ...focusOptions,
                })
        );

        useOnComponentLifeCycle({ model });

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

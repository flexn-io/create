import React, { useEffect, useRef, useState } from 'react';
import { View as RNView } from 'react-native';
import { SCREEN_STATES } from '../../focusManager/constants';
import type { ScreenProps } from '../../focusManager/types';
import { useCombinedRefs } from '../../hooks/useCombinedRef';
import ScreenClass from '../../focusManager/model/screen';
import useOnLayout from '../../hooks/useOnLayout';
import Event, { EVENT_TYPES } from '../../focusManager/events';
import useOnComponentLifeCycle from '../../hooks/useOnComponentLifeCycle';

const Screen = React.forwardRef<any, ScreenProps>(
    (
        {
            children,
            style,
            screenState = SCREEN_STATES.FOREGROUND,
            screenOrder = 0,
            group,
            stealFocus = true,
            focusOptions = {},
            onFocus,
            onBlur,
            ...props
        },
        refOuter
    ) => {
        const refInner = useRef(null);
        const [model] = useState<ScreenClass>(
            () =>
                new ScreenClass({
                    prevState: screenState,
                    state: screenState,
                    order: screenOrder,
                    stealFocus,
                    onFocus,
                    onBlur,
                    group,
                    ...focusOptions,
                })
        );

        const ref = useCombinedRefs<RNView>({ refs: [refOuter, refInner], model });

        const { onLayout } = useOnLayout(model);

        useOnComponentLifeCycle({ model });

        useEffect(() => {
            Event.emit(model, EVENT_TYPES.ON_PROPERTY_CHANGED, { property: 'state', newValue: screenState });
        }, [screenState]);

        useEffect(() => {
            Event.emit(model, EVENT_TYPES.ON_PROPERTY_CHANGED, { property: 'order', newValue: screenOrder });
        }, [screenOrder]);

        const chRendered = typeof children === 'function' ? children(model) : children;

        const childrenWithProps = React.Children.map(chRendered, (child) => {
            if (React.isValidElement(child)) {
                //@ts-ignore
                return React.cloneElement(child, { focusContext: model });
            }
            return child;
        });

        return (
            <RNView style={[{ flex: 1 }, style]} {...props} ref={ref} onLayout={onLayout}>
                {childrenWithProps}
            </RNView>
        );
    }
);

Screen.displayName = 'Screen';

export default Screen;

import React, { useEffect, useRef, useState } from 'react';
import { View as RNView } from 'react-native';
import type { ScreenProps } from '../../focusManager/types';
import { useCombinedRefs } from '../../hooks/useCombinedRef';
import ScreenClass from '../../focusManager/model/screen';
import useOnLayout from '../../hooks/useOnLayout';
import Event, { EVENT_TYPES } from '../../focusManager/events';
import useOnComponentLifeCycle from '../../hooks/useOnComponentLifeCycle';
import { CoreManager } from '../..';

const Screen = React.forwardRef<RNView | undefined, ScreenProps>(
    ({ children, style, focusOptions = {}, onFocus, onBlur, ...props }, refOuter) => {
        if (!CoreManager.isFocusManagerEnabled()) {
            return (
                <RNView style={style} {...props}>
                    {children}
                </RNView>
            );
        }

        const refInner = useRef(null);
        const [model] = useState<ScreenClass>(
            () =>
                new ScreenClass({
                    onFocus,
                    onBlur,
                    ...focusOptions,
                })
        );

        const ref = useCombinedRefs<RNView>({ refs: [refOuter, refInner], model });

        const { onLayout } = useOnLayout(model);

        useOnComponentLifeCycle({ model });

        useEffect(() => {
            if (focusOptions.screenState) {
                Event.emit(model.getType(), model.getId(), EVENT_TYPES.ON_PROPERTY_CHANGED, {
                    property: 'state',
                    newValue: focusOptions.screenState,
                });
            }
        }, [focusOptions.screenState]);

        useEffect(() => {
            if (focusOptions.screenOrder !== undefined) {
                Event.emit(model.getType(), model.getId(), EVENT_TYPES.ON_PROPERTY_CHANGED, {
                    property: 'order',
                    newValue: focusOptions.screenOrder,
                });
            }
        }, [focusOptions.screenOrder]);

        const chRendered = typeof children === 'function' ? (children as any)(model) : children;

        const childrenWithProps = React.Children.map(chRendered, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, { focusContext: model });
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

import React, { useEffect, useRef, useState } from 'react';
import { View as RNView } from 'react-native';
import { SCREEN_STATES } from '../../focusManager/constants';
import type { ScreenProps } from '../../focusManager/types';
import { useCombinedRefs } from '../../focusManager/helpers';
import CoreManager from '../../focusManager/model/core';
import { measure } from '../../focusManager/layoutManager';

import ScreenClass from '../../focusManager/model/screen';

const Screen = React.forwardRef<any, ScreenProps>(
    (
        {
            children,
            style,
            screenState = SCREEN_STATES.FOREGROUND,
            screenOrder = 0,
            stealFocus = true,
            focusOptions = {},
            onFocus = () => {
                return null;
            },
            onBlur = () => {
                return null;
            },
            ...props
        },
        refOuter
    ) => {
        const refInner = useRef(null);
        const ref = useCombinedRefs(refOuter, refInner);

        const [ClsInstance] = useState<ScreenClass>(
            () =>
                new ScreenClass({
                    prevState: screenState,
                    state: screenState,
                    order: screenOrder,
                    stealFocus,
                    onFocus,
                    onBlur,
                    ...focusOptions,
                })
        );

        CoreManager.registerFocusable(ClsInstance);

        useEffect(() => {
            ClsInstance.setPrevState(ClsInstance.getState()).setState(screenState);
            if (ClsInstance.isPrevStateBackground() && ClsInstance.isInForeground()) {
                ClsInstance.setFocus(ClsInstance.getFirstFocusableOnScreen());
            }
        }, [screenState]);

        useEffect(() => {
            ClsInstance.setOrder(screenOrder);
        }, [screenOrder]);

        useEffect(
            () => () => {
                CoreManager.removeFocusable(ClsInstance);
            },
            []
        );

        const onLayout = () => {
            measure(ClsInstance, ref);
        };

        const childrenWithProps = React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, { parentContext: ClsInstance });
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

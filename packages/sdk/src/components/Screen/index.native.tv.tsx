import React, { useEffect, useRef, useState } from 'react';
import { View as RNView } from 'react-native';
import { SCREEN_STATES, WINDOW_ALIGNMENT, DEFAULT_VIEWPORT_OFFSET } from '../../focusManager/constants';
import type { ScreenProps, Context } from '../../focusManager/types';
import { makeid, useCombinedRefs, alterForbiddenFocusDirections } from '../../focusManager/helpers';
import CoreManager from '../../focusManager/core';
import { measure } from '../../focusManager/layoutManager';

import { createOrReturnInstance } from '../../focusManager/screen';


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
        const {
            focusKey,
            nextFocusRight,
            nextFocusLeft,
            verticalWindowAlignment = WINDOW_ALIGNMENT.LOW_EDGE,
            horizontalWindowAlignment = WINDOW_ALIGNMENT.LOW_EDGE,
            horizontalViewportOffset = DEFAULT_VIEWPORT_OFFSET,
            verticalViewportOffset = DEFAULT_VIEWPORT_OFFSET,
            forbiddenFocusDirections,
        }: any = focusOptions;
        const [context] = useState(() => {
            const ctx: Context = {
                id: `screen-${makeid(8)}`,
                type: 'screen',
                children: [],
                prevState: screenState,
                state: screenState,
                order: screenOrder,
                stealFocus,
                focusKey,
                verticalWindowAlignment,
                horizontalWindowAlignment,
                horizontalViewportOffset,
                verticalViewportOffset,
                forbiddenFocusDirections: alterForbiddenFocusDirections(forbiddenFocusDirections),
                nextFocusRight,
                nextFocusLeft,
                onFocus,
                onBlur,
            };

            CoreManager.registerContext(ctx);
            ctx.screenCls = createOrReturnInstance(ctx);

            return ctx;
        });

        useEffect(() => {
            context.prevState = context.state;
            context.state = screenState;
            if (context.prevState === SCREEN_STATES.BACKGROUND && screenState === SCREEN_STATES.FOREGROUND) {
                if (context.screenCls) context.screenCls.initialLoadInProgress = true;
            }
        }, [screenState]);

        useEffect(() => {
            return () => {
                CoreManager.removeContext(context);
            };
        }, []);

        const onLayout = () => {
            measure(context, ref);
        };

        const childrenWithProps = React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, { parentContext: context });
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

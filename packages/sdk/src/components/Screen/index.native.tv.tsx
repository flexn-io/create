import React, { useEffect, useRef, useState } from 'react';
import { View as RNView } from 'react-native';
import { SCREEN_STATES, WINDOW_ALIGNMENT } from '../../focusManager/constants';
import type { ScreenProps, Context } from '../../focusManager/types';
import { mergeStyles, makeid, useCombinedRefs, alterForbiddenFocusDirections } from '../../focusManager/helpers';
import CoreManager from '../../focusManager/core';
import { measure } from '../../focusManager/layoutManager';

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
        const interval: { current: NodeJS.Timeout | null } = useRef(null);
        const {
            focusKey,
            verticalWindowAlignment = WINDOW_ALIGNMENT.LOW_EDGE,
            horizontalWindowAlignment = WINDOW_ALIGNMENT.LOW_EDGE,
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
                forbiddenFocusDirections: alterForbiddenFocusDirections(forbiddenFocusDirections),
                onFocus,
                onBlur,
            };

            CoreManager.registerContext(ctx, null);

            return ctx;
        });

        const setInitialFocus = (focusable: Context) => {
            CoreManager.currentContext?.screen?.onBlur?.();
            CoreManager.executeFocus('', focusable);
            CoreManager.executeUpdateGuideLines();
            context.onFocus?.();
        };

        const findInitialFocusable = () => {
            if (stealFocus) {
                let firstFocusable = CoreManager.findFirstFocusableOnScreen(context);
                if (firstFocusable) {
                    setInitialFocus(firstFocusable);
                } else {
                    // NOTE: why is interval? Because screen lifecycle if independent of child complex components lifecycles
                    // so screen can be loaded but focusable elements not yet
                    interval.current = setInterval(() => {
                        firstFocusable = CoreManager.findFirstFocusableOnScreen(context);
                        if (firstFocusable) {
                            clearInterval(interval.current as NodeJS.Timeout);
                            setInitialFocus(firstFocusable);
                        }
                    }, 100);
                }
            }
        };

        useEffect(() => {
            context.prevState = context.state;
            context.state = screenState;
            if (context.prevState === SCREEN_STATES.BACKGROUND && screenState === SCREEN_STATES.FOREGROUND) {
                findInitialFocusable();
            }
        }, [screenState]);

        useEffect(() => {
            findInitialFocusable();

            return () => {
                CoreManager.removeContext(context);
                if (interval.current) {
                    clearInterval(interval.current);
                }
            };
        }, []);

        const onLayout = () => {
            measure(context, ref, mergeStyles(style, null));
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

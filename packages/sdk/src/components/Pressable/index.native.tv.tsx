import React, { useEffect, useRef, useState } from 'react';
import { View as RNView } from 'react-native';
import {
    mergeStyles,
    makeid,
    useCombinedRefs,
    usePrevious,
    alterForbiddenFocusDirections,
} from '../../focusManager/helpers';
import type { Context, ViewProps } from '../../focusManager/types';
import CoreManager from '../../focusManager/core';
import { measure } from '../../focusManager/layoutManager';
import TvFocusableViewManager from '../../focusableView';

export const defaultAnimation = {
    type: 'scale',
    scale: 1.1,
};

const View = React.forwardRef<any, ViewProps>(
    (
        {
            children,
            style,
            focus = true,
            focusOptions = {},
            parentContext,
            repeatContext,
            onPress = () => {
                return null;
            },
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
        const prevFocus = usePrevious(focus);
        const pctx = repeatContext?.parentContext || parentContext;

        const makeContext = () => ({
            id: pctx?.id ? `${pctx.id}:view-${makeid(8)}` : `view-${makeid(8)}`,
            parent: pctx,
            children: [],
            repeatContext,
            isFocusable: true,
            // initialFocus: focusOptions.hasInitialFocus | false,
            forbiddenFocusDirections: alterForbiddenFocusDirections(focusOptions.forbiddenFocusDirections),
            type: 'view',
        });

        const [context, setContext] = useState(() => {
            if (focus) {
                return makeContext();
            }

            return pctx;
        });

        // We must reassing repeat context as View instances are re-used in recycled
        if (repeatContext) {
            context.repeatContext = repeatContext;
        }

        useEffect(() => {
            // If item initialy was not focusable, but during the time it became focusable
            // we capturing that here
            if (prevFocus === false && focus === true) {
                const ctx: Context = makeContext();
                setContext(ctx);
                CoreManager.registerContext(ctx, ref);
            }
        }, [focus]);

        useEffect(() => {
            if (ref.current) {
                ref.current.onPress = onPress;
                ref.current.onFocus = onFocus;
                ref.current.onBlur = onBlur;
            }
        }, [onPress, onFocus, onBlur]);

        useEffect(() => {
            if (focus) {
                CoreManager.registerContext(context, ref);
            }
            return () => {
                // CHILD CAN BE REMOVED INDEPENDENTLY
                if (focus) {
                    CoreManager.removeFromParentContext(context);
                    CoreManager.removeContext(context);
                    // IF ITEM WHICH WE ARE REMOVING WAS FOCUSED WE HAVE TO FIND NEXT TO FOCUS
                    if (context?.screen?.lastFocused?.id === context.id) {
                        const screenContext = CoreManager.contextMap[context.screen.id];
                        if (screenContext) {
                            screenContext.lastFocused = undefined;
                            // NOTE: why is interval? Because screen lifecycle if independent of child complex components lifecycles
                            // so screen can be loaded but focusable elements not yet
                            const interval = setInterval(() => {
                                const firstFocusable = CoreManager.findFirstFocusableOnScreen(screenContext);
                                if (firstFocusable) {
                                    clearInterval(interval);
                                    CoreManager.executeFocus('', firstFocusable);
                                    CoreManager.executeUpdateGuideLines();
                                    CoreManager.currentContext?.screen?.onBlur?.();
                                    screenContext.onFocus?.();
                                }
                            }, 100);
                        }
                    }
                }
            };
        }, []);

        const childrenWithProps = React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, { parentContext: context });
            }

            return child;
        });

        const onLayout = () => {
            measure(context, ref, mergeStyles(style, null));
        };

        // In recycled mode we must re-measure on render
        if (repeatContext && ref.current) {
            measure(context, ref, mergeStyles(style, null));
        }

        if (focus) {
            const { animatorOptions = defaultAnimation } = focusOptions;

            return (
                <TvFocusableViewManager
                    style={style}
                    onLayout={onLayout}
                    animatorOptions={animatorOptions}
                    {...props}
                    ref={ref}
                >
                    {childrenWithProps}
                </TvFocusableViewManager>
            );
        }

        return (
            <RNView style={style} {...props} ref={ref}>
                {childrenWithProps}
            </RNView>
        );
    }
);

View.displayName = 'View';

export default View;

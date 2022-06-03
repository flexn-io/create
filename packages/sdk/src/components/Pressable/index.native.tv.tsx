import React, { useEffect, useRef, useState } from 'react';
import { View as RNView } from 'react-native';
import { isPlatformTvos } from '@rnv/renative';
import {
    makeid,
    useCombinedRefs,
    usePrevious,
    alterForbiddenFocusDirections,
    flattenStyle,
} from '../../focusManager/helpers';
import type { Context, ViewProps } from '../../focusManager/types';
import CoreManager from '../../focusManager/core';
import { ANIMATIONS } from '../../focusManager/constants';
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
            // initialFocus: focusOptions.hasInitialFocus || false,
            forbiddenFocusDirections: alterForbiddenFocusDirections(focusOptions.forbiddenFocusDirections),
            type: 'view',
        });

        const [context, setContext] = useState(() => {
            if (focus) {
                return makeContext();
            }
            return pctx;
        });

        // We must re-assign repeat context as View instances are re-used in recycled
        if (repeatContext) {
            context.repeatContext = repeatContext;
        }

        useEffect(() => {            
            // If item initially was not focusable, but during the time it became focusable we capturing that here
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
                context.screen.screenCls.setIsLoading();
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
                                
                            context.screen.screenCls.setFocus(
                                context.screen.screenCls.getFirstFocusableOnScreen()
                            );
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
            measure(context, ref);
        };

        // In recycled mode we must re-measure on render
        if (repeatContext && ref.current) {
            measure(context, ref);
        }

        if (focus) {
            let animatorOptions = focusOptions.animatorOptions || defaultAnimation;

            const flattenedStyle = flattenStyle(style);
            animatorOptions = { ...animatorOptions, style: { ...flattenedStyle } };
            let borderProps = {};
            const isBorderAnimation = [ANIMATIONS.BORDER, ANIMATIONS.SCALE_BORDER].includes(animatorOptions.type);
            if (!isBorderAnimation) {
                borderProps = {
                    focusableBorderWidth: flattenedStyle.borderWidth,
                    focusableBorderLeftWidth: flattenedStyle.borderLeftWidth,
                    focusableBorderRightWidth: flattenedStyle.borderRightWidth,
                    focusableBorderTopWidth: flattenedStyle.borderTopWidth,
                    focusableBorderBottomWidth: flattenedStyle.borderBottomWidth,
                    focusableBorderStartWidth: flattenedStyle.borderStartWidth,
                    focusableBorderEndWidth: flattenedStyle.borderEndWith,
                };
            } else {
                if (isPlatformTvos) {
                    delete flattenedStyle.borderWidth;
                }
            }

            return (
                <TvFocusableViewManager
                    style={flattenedStyle}
                    onLayout={onLayout}
                    animatorOptions={animatorOptions}
                    {...borderProps}
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

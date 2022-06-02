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

import { createOrReturnInstance } from '../../focusManager/Model/view';

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
            parentClass,
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
        const pCls = repeatContext?.parentClass || parentClass;

        let ViewInstance: any = useRef().current;
        if (!focus) {
            ViewInstance = parentClass;
        } else {
            ViewInstance = createOrReturnInstance({
                focus,
                repeatContext,
                parentContext: pctx,
                parentClass: pCls,
                forbiddenFocusDirections: alterForbiddenFocusDirections(focusOptions.forbiddenFocusDirections),
            });
        }

        // We must re-assign repeat context as View instances are re-used in recycled
        if (repeatContext) {
            ViewInstance.context.repeatContext = repeatContext;
            ViewInstance.repeatContext = repeatContext;
        }

        useEffect(() => {            
            // If item initially was not focusable, but during the time it became focusable we capturing that here
            if (prevFocus === false && focus === true) {
                ViewInstance = createOrReturnInstance({
                    focus: true,
                    repeatContext,
                    parentContext: pctx,
                    parentClass,
                    forbiddenFocusDirections: alterForbiddenFocusDirections(focusOptions.forbiddenFocusDirections),
                });

                CoreManager.registerContext(ViewInstance.getContext(), ref);
                CoreManager.registerFocusable(ViewInstance);
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
                CoreManager.registerContext(ViewInstance.getContext(), ref);
                CoreManager.registerFocusable(ViewInstance);
                ViewInstance.getContext().screen.screenCls.setIsLoading();
            }

            return () => {
                // CHILD CAN BE REMOVED INDEPENDENTLY
                if (focus) {
                    CoreManager.removeFromParentContext(ViewInstance.getContext());
                    CoreManager.removeContext(ViewInstance.getContext());
                    // IF ITEM WHICH WE ARE REMOVING WAS FOCUSED WE HAVE TO FIND NEXT TO FOCUS
                    if (ViewInstance.getContext()?.screen?.lastFocused?.id === ViewInstance.getContext().id) {
                        const screenContext = CoreManager.contextMap[ViewInstance.getContext().screen.id];
                        if (screenContext) {
                            screenContext.lastFocused = undefined;
                                
                            ViewInstance.getContext().screen.screenCls.setFocus(
                                ViewInstance.getContext().screen.screenCls.getFirstFocusableOnScreen()
                            );
                        }
                    }
                }
            };
        }, []);

        const childrenWithProps = React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, { parentContext: ViewInstance.getContext(), parentClass: ViewInstance });
            }

            return child;
        });

        const onLayout = () => {
            measure(ViewInstance.getContext(), ref);
        };

        // In recycled mode we must re-measure on render
        if (repeatContext && ref.current) {
            measure(ViewInstance.getContext(), ref);
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

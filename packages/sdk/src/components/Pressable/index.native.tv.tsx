import React, { useEffect, useRef, useState } from 'react';
import { View as RNView, StyleSheet } from 'react-native';
import { isPlatformTvos } from '@rnv/renative';
import type { ViewProps } from '../../focusManager/types';
import { ANIMATIONS } from '../../focusManager/constants';
import { measureSync } from '../../focusManager/layoutManager';
import TvFocusableViewManager from '../../focusableView';

import ViewClass from '../../focusManager/model/view';
import useOnLayout from '../../hooks/useOnLayout';
import { useCombinedRefs } from '../../hooks/useCombinedRef';
import { usePrevious } from '../../hooks/usePrevious';
import Event, { EVENT_TYPES } from '../../focusManager/events';

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
            focusContext,
            focusRepeatContext,
            onPress,
            onFocus,
            onBlur,
            ...props
        },
        refOuter
    ) => {
        const refInner = useRef<RNView>();
        const prevFocus = usePrevious(focus);
        const parent = focusRepeatContext?.focusContext || focusContext;

        const [model, setModel] = useState<ViewClass>(() => {
            if (!focus) {
                return parent;
            } else {
                return new ViewClass({
                    focus,
                    focusRepeatContext,
                    parent,
                    ...focusOptions,
                });
            }
        });

        const ref = useCombinedRefs<RNView>({ refs: [refOuter, refInner], model: focus ? model : null });

        const { onLayout } = useOnLayout(model);

        const { onLayout: onLayoutNonPressable } = useOnLayout(
            model,
            () => {
                model?.remeasureChildrenLayouts?.(model);
            },
            true
        );

        // We must re-assign repeat context as View instances are re-used in recycled
        if (focusRepeatContext) {
            model.setRepeatContext(focusRepeatContext);
        }

        useEffect(() => {
            // If item initially was not focusable, but during the time it became focusable we capturing that here
            if (prevFocus === false && focus === true) {
                const model = new ViewClass({
                    focus: true,
                    focusRepeatContext,
                    parent,
                    forbiddenFocusDirections: focusOptions.forbiddenFocusDirections,
                });

                setModel(model);

                Event.emit(model, EVENT_TYPES.ON_MOUNT);
            }
        }, [focus]);

        useEffect(() => {
            if (focus) {
                Event.emit(model, EVENT_TYPES.ON_MOUNT);
            }
            return () => {
                if (focus) {
                    Event.emit(model, EVENT_TYPES.ON_UNMOUNT);
                }
            };
        }, []);

        useEffect(() => {
            model?.updateEvents?.({
                onPress,
                onFocus,
                onBlur,
            });
        }, [onPress, onFocus, onBlur]);

        // In recycled mode we must re-measure on render
        if (focusRepeatContext && ref.current) {
            // model.setNode(ref);
            measureSync({ model });
        }

        const childrenWithProps = React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                    focusContext: model,
                });
            }

            return child;
        });

        if (focus) {
            let animatorOptions = focusOptions.animatorOptions || defaultAnimation;

            const flattenedStyle = StyleSheet.flatten(style);
            animatorOptions = { ...animatorOptions, style: { ...flattenedStyle } };
            let borderProps = {};
            const isBorderAnimation = [ANIMATIONS.BORDER, ANIMATIONS.SCALE_BORDER].includes(animatorOptions.type);
            if (!isBorderAnimation && flattenedStyle) {
                borderProps = {
                    focusableBorderWidth: flattenedStyle.borderWidth,
                    focusableBorderLeftWidth: flattenedStyle.borderLeftWidth,
                    focusableBorderRightWidth: flattenedStyle.borderRightWidth,
                    focusableBorderTopWidth: flattenedStyle.borderTopWidth,
                    focusableBorderBottomWidth: flattenedStyle.borderBottomWidth,
                    focusableBorderStartWidth: flattenedStyle.borderStartWidth,
                    focusableBorderEndWidth: flattenedStyle.borderEndWidth,
                };
            } else {
                if (isPlatformTvos && flattenedStyle) {
                    delete flattenedStyle.borderWidth;
                }
            }

            return (
                <TvFocusableViewManager
                    isTVSelectable={true}
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
            <RNView style={style} {...props} ref={ref} onLayout={onLayoutNonPressable}>
                {childrenWithProps}
            </RNView>
        );
    }
);

View.displayName = 'View';

export default View;

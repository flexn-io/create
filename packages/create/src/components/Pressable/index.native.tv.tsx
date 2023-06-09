import React, { useEffect, useRef, useState } from 'react';
import { View as RNView, StyleSheet, Insets } from 'react-native';
import type { PressableProps } from '../../focusManager/types';
import { measureSync } from '../../focusManager/layoutManager';
import TvFocusableViewManager from '../../focusableView';

import ViewClass from '../../focusManager/model/view';
import useOnLayout from '../../hooks/useOnLayout';
import { useCombinedRefs } from '../../hooks/useCombinedRef';
import { usePrevious } from '../../hooks/usePrevious';
import Event, { EVENT_TYPES } from '../../focusManager/events';

const View = React.forwardRef<any, PressableProps>(
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
            hitSlop,
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
                const flattenStyle = StyleSheet.flatten(style);

                return new ViewClass({
                    focus,
                    focusRepeatContext,
                    parent,
                    verticalContentContainerGap:
                        flattenStyle?.marginVertical ||
                        flattenStyle?.paddingVertical ||
                        flattenStyle?.marginTop ||
                        flattenStyle?.paddingTop ||
                        flattenStyle?.margin ||
                        flattenStyle?.padding ||
                        flattenStyle?.top,
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
        if (focusRepeatContext && ref?.current) {
            measureSync({ model });
        }

        const childrenWithProps = React.Children.map(children as React.ReactElement[], (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, {
                    focusContext: model,
                });
            }

            return child;
        });

        if (focus) {
            const animatorOptions = focusOptions.animator || { type: 'scale', focus: { scale: 1.1 } };
            const { borderWidth, borderColor, borderRadius, backgroundColor } = { ...StyleSheet.flatten(style) } || {};

            return (
                <TvFocusableViewManager
                    isTVSelectable={true}
                    style={style}
                    onLayout={onLayout}
                    animatorOptions={{
                        ...animatorOptions,
                        blur: {
                            borderWidth,
                            borderColor,
                            borderRadius,
                            backgroundColor,
                        },
                    }}
                    {...props}
                    ref={ref}
                >
                    {childrenWithProps}
                </TvFocusableViewManager>
            );
        }

        return (
            <RNView style={style} {...props} ref={ref} onLayout={onLayoutNonPressable} hitSlop={hitSlop as Insets}>
                {childrenWithProps}
            </RNView>
        );
    }
);

View.displayName = 'View';

export default View;

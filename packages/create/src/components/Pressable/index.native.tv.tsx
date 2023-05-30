import React, { useEffect, useRef, useState } from 'react';
import { View as RNView, StyleSheet } from 'react-native';
import type { ViewProps } from '../../focusManager/types';
import { measureSync } from '../../focusManager/layoutManager';
import TvFocusableViewManager from '../../focusableView';

import ViewClass from '../../focusManager/model/view';
import useOnLayout from '../../hooks/useOnLayout';
import { useCombinedRefs } from '../../hooks/useCombinedRef';
import { usePrevious } from '../../hooks/usePrevious';
import Event, { EVENT_TYPES } from '../../focusManager/events';

const defaultAnimation = {
    type: 'scale',
    focus: {
        scale: 1.1,
    },
    blur: {
        scale: 1,
    },
    // duration: 150,
};

type FocusAnimation = {
    focus?: {
        borderWidth?: number;
        borderColor?: string;
        backgroundColor?: string;
        scale?: number;
    };
    blur?: {
        borderWidth?: number;
        borderColor?: string;
        backgroundColor?: string;
        scale?: number;
    };
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
        //@ts-ignore
        if (focusRepeatContext && ref?.current) {
            // model.setNode(ref);
            measureSync({ model });
        }

        const childrenWithProps = React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, {
                    focusContext: model,
                });
            }

            return child;
        });

        if (focus) {
            const animatorOptions: FocusAnimation = focusOptions.animatorOptions || defaultAnimation;
            const flattenedStyle = { ...StyleSheet.flatten(style) };

            if (animatorOptions.blur?.borderWidth !== undefined) {
                flattenedStyle.borderWidth = animatorOptions.blur?.borderWidth;
            }
            if (animatorOptions.blur?.borderColor !== undefined) {
                flattenedStyle.borderColor = animatorOptions.blur?.borderColor;
            }
            if (animatorOptions.blur?.backgroundColor !== undefined) {
                flattenedStyle.backgroundColor = animatorOptions.blur?.backgroundColor;
            }

            return (
                <TvFocusableViewManager
                    isTVSelectable={true}
                    style={flattenedStyle}
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
            <RNView style={style} {...props} ref={ref} onLayout={onLayoutNonPressable}>
                {childrenWithProps}
            </RNView>
        );
    }
);

View.displayName = 'View';

export default View;

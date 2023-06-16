import React, { useEffect, useRef, useState } from 'react';
import { View as RNView, StyleSheet, Animated, Insets } from 'react-native';
import type { PressableProps } from '../../focusManager/types';
import { measureSync } from '../../focusManager/layoutManager';
import ViewClass from '../../focusManager/model/view';
import useOnLayout from '../../hooks/useOnLayout';
import { useCombinedRefs } from '../../hooks/useCombinedRef';
import { usePrevious } from '../../hooks/usePrevious';
import Event, { EVENT_TYPES } from '../../focusManager/events';

import { ANIMATION_TYPES, AnimatorBackground, AnimatorBorder, AnimatorScale, AnimatorScaleWithBorder } from '../..';

const View = React.forwardRef<RNView | undefined, PressableProps>(
    (
        {
            children,
            hitSlop,
            style,
            focus = true,
            focusOptions = {},
            focusContext,
            focusRepeatContext,
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
        const scaleAnim = useRef(new Animated.Value(1)).current;
        const refInner = useRef<RNView>();

        const prevFocus = usePrevious(focus);
        const parent = focusRepeatContext?.focusContext || focusContext;
        const animatorOptions = focusOptions.animator || { type: 'scale', focus: { scale: 1.1 } };
        const flattenStyle = StyleSheet.flatten(style);

        const [model, setModel] = useState(() => {
            if (!focus) {
                return parent;
            } else {
                const gapVertical =
                    flattenStyle?.marginVertical ||
                    flattenStyle?.paddingVertical ||
                    flattenStyle?.marginTop ||
                    flattenStyle?.paddingTop ||
                    flattenStyle?.margin ||
                    flattenStyle?.padding ||
                    flattenStyle?.top;

                //TODO: not very accurate
                const gapHorizontal =
                    flattenStyle?.marginHorizontal ||
                    flattenStyle?.paddingHorizontal ||
                    flattenStyle?.marginLeft ||
                    flattenStyle?.marginRight ||
                    flattenStyle?.paddingLeft ||
                    flattenStyle?.paddingRight ||
                    flattenStyle?.margin ||
                    flattenStyle?.padding ||
                    flattenStyle?.left;

                return new ViewClass({
                    focus,
                    focusRepeatContext,
                    focusContext: parent,
                    verticalContentContainerGap: typeof gapVertical === 'string' ? 0 : gapVertical,
                    horizontalContentContainerGap: typeof gapHorizontal === 'string' ? 0 : gapHorizontal,
                    ...focusOptions,
                    onFocus: onComponentFocus,
                    onBlur: onComponentBlur,
                });
            }
        });

        const ref = useCombinedRefs<RNView>({ refs: [refOuter, refInner], model: focus ? model : null });

        const onComponentFocus = () => {
            switch (animatorOptions.type) {
                case ANIMATION_TYPES.SCALE:
                    Animated.timing(scaleAnim, {
                        toValue: (animatorOptions as AnimatorScale).focus.scale as number,
                        duration: 200,
                        useNativeDriver: true,
                    }).start();
                    break;
                case ANIMATION_TYPES.SCALE_BORDER:
                    Animated.timing(scaleAnim, {
                        toValue: (animatorOptions as AnimatorScale).focus.scale as number,
                        duration: 200,
                        useNativeDriver: true,
                    }).start();
                    ref.current.setNativeProps({
                        style: {
                            borderColor: (animatorOptions as AnimatorScaleWithBorder).focus.borderColor,
                            borderWidth: (animatorOptions as AnimatorScaleWithBorder).focus.borderWidth,
                        },
                    });
                    break;
                case ANIMATION_TYPES.BORDER:
                    ref.current.setNativeProps({
                        style: {
                            borderColor: (animatorOptions as AnimatorBorder).focus.borderColor,
                            borderWidth: (animatorOptions as AnimatorBorder).focus.borderWidth,
                        },
                    });
                    break;
                case ANIMATION_TYPES.BACKGROUND:
                    ref.current.setNativeProps({
                        style: {
                            backgroundColor: (animatorOptions as AnimatorBackground).focus.backgroundColor,
                        },
                    });
                    break;
                default:
                    break;
            }

            onFocus();
        };

        const onComponentBlur = () => {
            switch (animatorOptions.type) {
                case ANIMATION_TYPES.SCALE:
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }).start();
                    break;
                case ANIMATION_TYPES.SCALE_BORDER:
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }).start();
                    ref.current.setNativeProps({
                        style: {
                            borderWidth: 0,
                        },
                    });
                    break;
                case ANIMATION_TYPES.BORDER:
                    ref.current.setNativeProps({
                        style: {
                            borderWidth: 0,
                        },
                    });
                    break;
                case ANIMATION_TYPES.BACKGROUND:
                    ref.current.setNativeProps({
                        style: {
                            backgroundColor: flattenStyle.backgroundColor,
                        },
                    });
                    break;
                default:
                    break;
            }

            onBlur();
        };

        // We must re-assign repeat context as View instances are re-used in recycled
        if (focusRepeatContext) {
            model.setRepeatContext(focusRepeatContext);
        }

        useEffect(() => {
            if (focus) {
                scaleAnim.addListener(({ value }) => {
                    if (ref.current) {
                        ref.current.setNativeProps({
                            style: {
                                transform: [{ scale: value }],
                            },
                        });
                    }
                });
            }

            return () => {
                scaleAnim.removeAllListeners();
            };
        }, [focus]);

        const { onLayout } = useOnLayout(model);

        const { onLayout: onLayoutNonPressable } = useOnLayout(
            model,
            () => {
                model?.remeasureSelfAndChildrenLayouts?.(model);
            },
            true
        );

        // We must re-assign repeat context as View instances are re-used in recycled
        if (focusRepeatContext && model.setRepeatContext) {
            model.setRepeatContext(focusRepeatContext);
        }

        useEffect(() => {
            // If item initially was not focusable, but during the time it became focusable we capturing that here
            if (prevFocus === false && focus === true) {
                const model = new ViewClass({
                    focus: true,
                    focusRepeatContext,
                    focusContext: parent,
                    forbiddenFocusDirections: focusOptions.forbiddenFocusDirections,
                });

                setModel(model);

                Event.emit(model.getType(), model.getId(), EVENT_TYPES.ON_MOUNT);
            }
        }, [focus]);

        useEffect(() => {
            if (focus) {
                Event.emit(model.getType(), model.getId(), EVENT_TYPES.ON_MOUNT);
            }
            return () => {
                if (focus) {
                    Event.emit(model.getType(), model.getId(), EVENT_TYPES.ON_UNMOUNT);
                }
            };
        }, []);

        useEffect(() => {
            model?.updateEvents?.({
                onPress,
                onFocus: onComponentFocus,
                onBlur: onComponentBlur,
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
            return (
                <RNView style={flattenStyle} onLayout={onLayout} {...props} ref={ref}>
                    {childrenWithProps}
                </RNView>
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

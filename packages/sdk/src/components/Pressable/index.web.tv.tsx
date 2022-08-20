import React, { useEffect, useRef, useState } from 'react';
import { View as RNView } from 'react-native';
import { useCombinedRefs, usePrevious, flattenStyle } from '../../focusManager/helpers';
import type { ViewProps } from '../../focusManager/types';
import CoreManager from '../../focusManager/model/core';
import { measure } from '../../focusManager/layoutManager';

import ViewClass from '../../focusManager/model/view';
import Screen from '../../focusManager/model/screen';

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

        const [ViewInstance, setViewInstance] = useState(() => {
            if (!focus) {
                return pctx;
            } else {
                return new ViewClass({
                    focus,
                    repeatContext,
                    parent: pctx,
                    ...focusOptions,
                });
            }
        });

        // We must re-assign repeat context as View instances are re-used in recycled
        if (repeatContext) {
            ViewInstance.setRepeatContext(repeatContext);
        }

        useEffect(() => {
            // If item initially was not focusable, but during the time it became focusable we capturing that here
            if (prevFocus === false && focus === true) {
                const cls = new ViewClass({
                    focus: true,
                    repeatContext,
                    parent: pctx,
                    forbiddenFocusDirections: focusOptions.forbiddenFocusDirections,
                });

                setViewInstance(cls);
                CoreManager.registerFocusable(cls, ref);
            }
        }, [focus]);

        useEffect(() => {
            (ViewInstance as ViewClass)?.updateEvents?.({
                onPress,
                onFocus,
                onBlur,
            });
        }, [onPress, onFocus, onBlur]);

        useEffect(() => {
            if (focus) {
                CoreManager.registerFocusable(ViewInstance, ref);
                const screen = ViewInstance.getScreen() as Screen;
                if (screen) {
                    screen.addComponentToPendingLayoutMap(ViewInstance.getId());
                    if (ViewInstance.hasPreferredFocus()) screen.setPreferredFocus(ViewInstance);
                }
            }

            return () => {
                if (focus) {

                    CoreManager.removeFocusable(ViewInstance);
                    ViewInstance.getScreen()?.onViewRemoved(ViewInstance);
                }
            };
        }, []);

        const childrenWithProps = React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                    parentContext: ViewInstance,
                });
            }

            return child;
        });

        const onLayout = () => {
            measure(ViewInstance, ref, undefined, () => {
                ViewInstance.getScreen()?.removeComponentFromPendingLayoutMap(ViewInstance.getId());
            });
        };

        // In recycled mode we must re-measure on render
        if (repeatContext && ref.current) {
            measure(ViewInstance, ref);
        }

        if (focus) {
            const flattenedStyle = flattenStyle(style);

            return (
                <RNView
                    style={flattenedStyle}
                    onLayout={onLayout}
                    {...props}
                    ref={ref}
                >
                    {childrenWithProps}
                </RNView>
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

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

import { createInstance } from '../../focusManager/Model/view';
import type { ViewCls } from '../../focusManager/Model/view';

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
                return createInstance({
                    focus,
                    repeatContext,
                    parent: pctx,
                    forbiddenFocusDirections: alterForbiddenFocusDirections(focusOptions.forbiddenFocusDirections),
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
                const cls = createInstance({
                    focus: true,
                    repeatContext,
                    parent: pctx,
                    forbiddenFocusDirections: alterForbiddenFocusDirections(focusOptions.forbiddenFocusDirections),
                });

                setViewInstance(cls);
                CoreManager.registerFocusable(cls, ref);
            }
        }, [focus]);

        useEffect(() => {
            (ViewInstance as ViewCls)?.updateEvents?.({
                onPress,
                onFocus,
                onBlur,
            });
        }, [onPress, onFocus, onBlur]);

        useEffect(() => {
            if (focus) {
                CoreManager.registerFocusable(ViewInstance, ref);
                (ViewInstance as ViewCls).getScreen()?.setIsLoading();
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
            measure(ViewInstance, ref);
        };

        // In recycled mode we must re-measure on render
        if (repeatContext && ref.current) {
            measure(ViewInstance, ref);
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

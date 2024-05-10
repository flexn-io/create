import React, { useEffect, useRef, useState } from 'react';
import { View as RNView } from 'react-native';
import type { ScreenProps } from '../../focusManager/types';
import { useCombinedRefs } from '../../hooks/useCombinedRef';
import ScreenClass from '../../focusManager/model/screen';
import useOnLayout from '../../hooks/useOnLayout';
import useOnComponentLifeCycle from '../../hooks/useOnComponentLifeCycle';
import { CoreManager } from '../..';

const Screen = React.forwardRef<RNView | undefined, ScreenProps>(
    (
        { children, style, focusOptions = {}, onFocus, onBlur, ...props },
        refOuter
    ) => {
        if (!CoreManager.isFocusManagerEnabled()) {
            return (
                <RNView style={style} {...props}>
                    {children}
                </RNView>
            );
        }

        const refInner = useRef(null);
        const [model] = useState<ScreenClass>(
            () =>
                new ScreenClass({
                    onFocus,
                    onBlur,
                    ...focusOptions,
                })
        );

        const ref = useCombinedRefs<RNView>({
            refs: [refOuter, refInner],
            model,
        });

        const { onLayout } = useOnLayout(model);

        useOnComponentLifeCycle({ model });

        useEffect(() => {
            model.setFocusKey(focusOptions.focusKey);
        }, [focusOptions.focusKey]);

        useEffect(() => {
            if (focusOptions.screenState) {
                const anotherScreenInForeground = Object.values(
                    CoreManager.getScreens()
                ).find(
                    (s) => s.getId() !== model.getId() && s.isInForeground()
                );
                const anotherForegroundScreenHasFocus =
                    anotherScreenInForeground &&
                    anotherScreenInForeground.getCurrentFocus() &&
                    CoreManager.getCurrentFocus() &&
                    anotherScreenInForeground.getCurrentFocus()?.getId() ===
                        CoreManager.getCurrentFocus()?.getId();

                model
                    .setPrevState(model.getState())
                    .setState(focusOptions.screenState);

                if (
                    !model.isInitialFocusIgnored() &&
                    model.isPrevStateBackground() &&
                    model.isInForeground() &&
                    !anotherForegroundScreenHasFocus
                ) {
                    model
                        .getFirstFocusableOnScreen()
                        ?.then((view) => CoreManager.executeFocus(view));
                }
            }
        }, [focusOptions.screenState]);

        useEffect(() => {
            if (focusOptions.screenOrder !== undefined) {
                model.setOrder(focusOptions.screenOrder);
            }
        }, [focusOptions.screenOrder]);

        const chRendered =
            typeof children === 'function'
                ? (children as any)(model)
                : children;

        const childrenWithProps = React.Children.map(chRendered, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, {
                    focusContext: model,
                });
            }
            return child;
        });

        return (
            <RNView
                style={[{ flex: 1 }, style]}
                {...props}
                ref={ref}
                onLayout={onLayout}
            >
                {childrenWithProps}
            </RNView>
        );
    }
);

Screen.displayName = 'Screen';

export default Screen;

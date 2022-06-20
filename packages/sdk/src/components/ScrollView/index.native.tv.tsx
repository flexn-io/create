import React, { useEffect, useRef, useState, useImperativeHandle } from 'react';
import { ScrollView as RNScrollView } from 'react-native';
import type { ScrollViewProps } from '../../focusManager/types';
import CoreManager from '../../focusManager/model/core';
import { measure, recalculateLayout } from '../../focusManager/layoutManager';
import ScrollViewClass from '../../focusManager/model/scrollview';

const ScrollView = React.forwardRef<any, ScrollViewProps>(
    ({ children, style, parentContext, horizontal, focusOptions, ...props }: ScrollViewProps, refOuter) => {
        const ref = useRef<RNScrollView>() as React.MutableRefObject<RNScrollView>;

        const [ClsInstance] = useState<ScrollViewClass>(
            () =>
                new ScrollViewClass({
                    horizontal,
                    parent: parentContext,
                    ...focusOptions,
                })
        );

        useImperativeHandle(refOuter, () => ({
            scrollTo: ({ x, y }: { x?: number; y?: number }) => {
                if (ref.current) ref.current.scrollTo({ x, y });
                if (x !== undefined) ClsInstance.setScrollOffsetX(x);
                if (y !== undefined) ClsInstance.setScrollOffsetY(y);
                if (CoreManager._currentFocus) {
                    recalculateLayout(CoreManager._currentFocus);
                }
            },
        }));

        const childrenWithProps = React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, { parentContext: ClsInstance });
            }
            return child;
        });

        useEffect(() => {
            CoreManager.registerFocusable(ClsInstance, ref);

            return () => {
                CoreManager.removeFocusable(ClsInstance);
            };
        }, []);

        const onLayout = () => {
            measure(ClsInstance, ref);
        };

        return (
            <RNScrollView
                ref={ref}
                onLayout={onLayout}
                style={style}
                horizontal={horizontal}
                scrollEnabled={false}
                scrollEventThrottle={320}
                onScroll={(event) => {
                    const { height, width } = event.nativeEvent.contentSize;
                    const { y, x } = event.nativeEvent.contentOffset;
                    const { height: scrollContentHeight } = event.nativeEvent.layoutMeasurement;

                    ClsInstance
                        .setScrollOffsetY(y)
                        .setScrollOffsetX(x)
                        .updateLayoutProperty('yMaxScroll', height)
                        .updateLayoutProperty('xMaxScroll', width)
                        .updateLayoutProperty('scrollContentHeight', scrollContentHeight);

                    ClsInstance.recalculateChildrenLayouts(ClsInstance);

                }}
                {...props}
            >
                {childrenWithProps}
            </RNScrollView>
        );
    }
);

export default ScrollView;

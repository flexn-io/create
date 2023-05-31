import React, { useState, useImperativeHandle } from 'react';
import { ScrollView as RNScrollView } from 'react-native';
import type { ScrollViewProps } from '../../focusManager/types';
import CoreManager from '../../focusManager/service/core';
import { recalculateLayout } from '../../focusManager/layoutManager';
import ScrollViewClass from '../../focusManager/model/scrollview';
import useOnLayout from '../../hooks/useOnLayout';
import useOnComponentLifeCycle from '../../hooks/useOnComponentLifeCycle';
import useOnRefChange from '../../hooks/useOnRefChange';

const ScrollView = React.forwardRef<any, ScrollViewProps>(
    ({ children, style, focusContext, horizontal, focusOptions, ...props }: ScrollViewProps, refOuter) => {
        const [model] = useState<ScrollViewClass>(
            () =>
                new ScrollViewClass({
                    horizontal,
                    parent: focusContext,
                    ...focusOptions,
                })
        );

        const { onRefChange, targetRef } = useOnRefChange(model);

        useImperativeHandle(refOuter, () => ({
            scrollTo: ({ x, y }: { x?: number; y?: number }) => {
                if (targetRef.current) targetRef.current.scrollTo({ x, y });
                if (x !== undefined) model.setScrollOffsetX(x);
                if (y !== undefined) model.setScrollOffsetY(y);
                if (CoreManager._currentFocus) {
                    recalculateLayout(CoreManager._currentFocus);
                }
            },
        }));

        useOnComponentLifeCycle({ model });

        const { onLayout } = useOnLayout(model);

        const childrenWithProps = React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, { focusContext: model });
            }
            return child;
        });

        return (
            <RNScrollView
                ref={onRefChange}
                onLayout={onLayout}
                style={style}
                horizontal={horizontal}
                scrollEnabled={false}
                scrollEventThrottle={320}
                onScroll={(event) => {
                    const { height, width } = event.nativeEvent.contentSize;
                    const { y, x } = event.nativeEvent.contentOffset;
                    const { height: scrollContentHeight } = event.nativeEvent.layoutMeasurement;
                    const endY = scrollContentHeight + y >= height;

                    if (model.getLayout()) {
                        if (model.getLayout()['scrollTargetY'] === y || endY) {
                            model.setIsScrollingVertically(false);
                        } else {
                            model.setIsScrollingVertically(true);
                        }

                        model
                            .setScrollOffsetY(y)
                            .setScrollOffsetX(x)
                            .updateLayoutProperty('yMaxScroll', height)
                            .updateLayoutProperty('xMaxScroll', width)
                            .updateLayoutProperty('scrollContentHeight', scrollContentHeight);

                        model.recalculateChildrenLayouts(model);
                    }
                }}
                {...props}
            >
                {childrenWithProps}
            </RNScrollView>
        );
    }
);

export default ScrollView;

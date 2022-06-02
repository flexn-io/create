import React, { useEffect, useRef, useState, useImperativeHandle } from 'react';
import { ScrollView as RNScrollView } from 'react-native';
import { makeid } from '../../focusManager/helpers';
import type { ScrollViewProps } from '../../focusManager/types';
import CoreManager from '../../focusManager/core';
import { measure, recalculateLayout } from '../../focusManager/layoutManager';
import { createOrReturnInstance } from '../../focusManager/Model/scrollview';

const ScrollView = React.forwardRef<any, ScrollViewProps>(
    ({ children, style, parentContext, parentClass, horizontal, ...props }: ScrollViewProps, refOuter) => {
        const ref = useRef<RNScrollView>() as React.MutableRefObject<RNScrollView>;

        const ScrollViewInstance = useRef(createOrReturnInstance({
            isHorizontal: horizontal,
            parent: parentContext,
            parentClass,
        })).current;

        useImperativeHandle(refOuter, () => ({
            scrollTo: ({ x, y }: { x?: number; y?: number }) => {
                if (ref.current) ref.current.scrollTo({ x, y });
                if (x !== undefined) ScrollViewInstance.context.scrollOffsetX = x;
                if (y !== undefined) ScrollViewInstance.context.scrollOffsetY = y;
                if (CoreManager.currentContext) {
                    recalculateLayout(CoreManager.currentContext);
                }
            },
        }));

        const childrenWithProps = React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, { parentContext: ScrollViewInstance.getContext(), parentClass: ScrollViewInstance });
            }
            return child;
        });

        useEffect(() => {
            CoreManager.registerContext(ScrollViewInstance.getContext(), ref);
            CoreManager.registerFocusable(ScrollViewInstance, ref);
        }, []);

        const onLayout = () => {
            measure(ScrollViewInstance.getContext(), ref);
        };

        return (
            <RNScrollView
                ref={ref}
                onLayout={onLayout}
                style={style}
                horizontal={horizontal}
                scrollEnabled={false}
                {...props}
            >
                {childrenWithProps}
            </RNScrollView>
        );
    }
);

export default ScrollView;

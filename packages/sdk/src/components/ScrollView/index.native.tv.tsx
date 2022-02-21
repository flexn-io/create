import React, { useEffect, useRef, useState, useImperativeHandle } from 'react';
import { ScrollView as RNScrollView } from 'react-native';
import { mergeStyles, makeid } from '../../focusManager/helpers';
import type { ScrollViewProps } from '../../focusManager/types';
import CoreManager from '../../focusManager/core';
import { measure, recalculateLayout } from '../../focusManager/layoutManager';

const ScrollView = React.forwardRef<any, ScrollViewProps>(
    ({ children, style, parentContext, horizontal, ...props }: ScrollViewProps, refOuter) => {
        const ref = useRef<RNScrollView>() as React.MutableRefObject<RNScrollView>;

        const [context] = useState(() => ({
            id: `scroll-${makeid(8)}`,
            children: [],
            isFocusable: false,
            isScrollable: true,
            scrollOffsetX: 0,
            scrollOffsetY: 0,
            type: 'scrollView',
            isHorizontal: horizontal,
            parent: parentContext,
        }));

        useImperativeHandle(refOuter, () => ({
            scrollTo: ({ x, y }: { x?: number; y?: number }) => {
                if (ref.current) ref.current.scrollTo({ x, y });
                if (x !== undefined) context.scrollOffsetX = x;
                if (y !== undefined) context.scrollOffsetY = y;
                recalculateLayout(CoreManager.currentContext);
            },
        }));

        const childrenWithProps = React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, { parentContext: context });
            }
            return child;
        });

        useEffect(() => {
            CoreManager.registerContext(context, ref);
        }, []);

        const onLayout = () => {
            measure(context, ref, mergeStyles(style, null));
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

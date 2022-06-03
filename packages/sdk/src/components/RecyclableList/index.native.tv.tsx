import React, { useEffect, useRef, useState } from 'react';
import { View as RNView, StyleSheet } from 'react-native';
import {
    DataProvider as RecyclableListDataProvider,
    LayoutProvider as RecyclableListLayoutProvider,
    RecyclerListView,
} from '../../recyclerListView';
import CoreManager from '../../focusManager/core';
import { alterForbiddenFocusDirections, makeid } from '../..//focusManager/helpers';
import { measure } from '../../focusManager/layoutManager';
import type { Context, RecyclerViewProps } from '../../focusManager/types';
import { createInstance } from '../../focusManager/Model/recycler';

const Column = null;

const parseStyleProps = (prop?: string | number): number => {
    if (typeof prop !== 'number') {
        return 0;
    }

    return prop;
};

export default function RecyclerView({
    style,
    parentContext,
    isHorizontal = true,
    rowRenderer,
    scrollViewProps,
    dataProvider,
    repeatContext,
    contentContainerStyle,
    unmeasurableRelativeDimensions = { y: 0, x: 0 },
    focusOptions = {},
    ...props
}: RecyclerViewProps) {
    const scrollViewRef = useRef<HTMLDivElement | null>(null);
    const rlvRef = useRef<RecyclerListView<any, any>>(null);
    const rnViewRef = useRef<RNView>(null);

    const [ClsInstance] = useState(() =>
        createInstance({
            isHorizontal,
            isNested: !!repeatContext,
            parent: parentContext,
            repeatContext,
            forbiddenFocusDirections: alterForbiddenFocusDirections(focusOptions.forbiddenFocusDirections),
        })
    );

    if (repeatContext) {
        ClsInstance.setRepeatContext(repeatContext);
    }

    const rowRendererWithProps = (type: any, data: any, index: any) => {
        const vr = rlvRef.current?.['_virtualRenderer'];
        const lm: any = vr?.['_layoutManager'];
        const layouts: any = lm?.['_layouts'];

        if (vr && (!ClsInstance.getLayouts() || layouts.length !== ClsInstance.getLayouts().length)) {
            ClsInstance.setLayouts(layouts);
        }

        if (vr?.['_params'] && !ClsInstance.isLastVisible) {
            const recyclerItemsCount = vr['_params'].itemCount;
            const vt: any = vr['_viewabilityTracker'] || {};

            ClsInstance.isLastVisible = () => {
                const visibleIndexes = vt['_visibleIndexes'];
                return visibleIndexes[visibleIndexes.length - 1] + 1 === recyclerItemsCount;
            };

            ClsInstance.isFirstVisible = () => {
                const visibleIndexes = vt['_visibleIndexes'];
                return visibleIndexes[0] === 0;
            };
        }

        return rowRenderer(type, data, index, {
            parentContext: ClsInstance,
            index,
        });
    };

    useEffect(() => {
        CoreManager.registerFocusable(ClsInstance, scrollViewRef);
    }, []);

    useEffect(() => {
        return () => {
            // CoreManager.removeContext(RecyclerInstance.getContext());
        };
    }, []);

    const flattenContentContainerStyle = StyleSheet.flatten(contentContainerStyle);
    const flattenStyles = StyleSheet.flatten(style);

    const paddingTop = parseStyleProps(flattenContentContainerStyle?.paddingTop);
    const paddingLeft = parseStyleProps(flattenContentContainerStyle?.paddingLeft);
    const marginTop = parseStyleProps(flattenStyles?.marginTop);
    const marginLeft = parseStyleProps(flattenStyles?.marginLeft);
    const top = parseStyleProps(flattenStyles?.top);
    const left = parseStyleProps(flattenStyles?.left);

    const onLayout = () => {
        const unmeasurableDimensions = {
            x: paddingLeft + marginLeft + left + (unmeasurableRelativeDimensions.x || 0),
            y: paddingTop + marginTop + top + (unmeasurableRelativeDimensions.y || 0),
        };
        measure(ClsInstance, rnViewRef, unmeasurableDimensions);
    };

    return (
        <RNView ref={rnViewRef} onLayout={onLayout} style={style}>
            <RecyclerListView
                ref={rlvRef}
                dataProvider={dataProvider}
                scrollViewProps={{
                    ...scrollViewProps,
                    ref: (ref: any) => {
                        // eslint-disable-next-line no-underscore-dangle
                        scrollViewRef.current = ref?._scrollViewRef; // `scrollTo()` is not working otherwise
                    },
                    scrollEnabled: false,
                }}
                rowRenderer={rowRendererWithProps}
                isHorizontal={isHorizontal}
                contentContainerStyle={contentContainerStyle}
                {...props}
            />
        </RNView>
    );
}

export { RecyclableListDataProvider, RecyclableListLayoutProvider, Column };

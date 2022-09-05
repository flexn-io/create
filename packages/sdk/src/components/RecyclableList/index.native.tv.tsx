import React, { useEffect, useRef, useState } from 'react';
import { View as RNView, StyleSheet } from 'react-native';
import {
    DataProvider as RecyclableListDataProvider,
    LayoutProvider as RecyclableListLayoutProvider,
    RecyclerListView,
} from '../../recyclerListView';
import CoreManager from '../../focusManager/model/core';
import { measure } from '../../focusManager/layoutManager';
import type { RecyclerViewProps } from '../../focusManager/types';
import Grid from '../../focusManager/model/grid';
import List from '../../focusManager/model/list';
import Row from '../../focusManager/model/row';

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
    disableItemContainer = false,
    type,
    initialRenderIndex,
    onFocus = () => {
        return null;
    },
    onBlur = () => {
        return null;
    },
    ...props
}: RecyclerViewProps) {
    const layoutsReady = useRef(false);
    const scrollViewRef = useRef<HTMLDivElement | null>(null);
    const rlvRef = useRef<RecyclerListView<any, any>>(null);
    const rnViewRef = useRef<RNView>(null);

    if (!type) {
        throw new Error('Please specify type. One of grid, list, row');
    }

    if (!['list', 'grid', 'row'].includes(type)) {
        throw new Error(`Incorrect type ${type}. Valid types is grid, list, row`);
    }

    const pctx = repeatContext?.parentContext || parentContext;

    // const [stateIndex, setStateIndex] = useState(repeatContext?.index);

    const [ClsInstance] = useState(() => {
        const params = {
            isHorizontal,
            isNested: !!repeatContext,
            parent: pctx,
            repeatContext,
            initialRenderIndex,
            onFocus,
            onBlur,
            ...focusOptions,
        };

        if (type === 'grid') {
            return new Grid(params);
        } else if (type === 'row') {
            return new Row(params);
        } else {
            return new List(params);
        }
    });

    if (repeatContext) {
        ClsInstance.setRepeatContext(repeatContext);
    }

    const rowRendererWithProps = (type: any, data: any, index: any, _extendedState: any, renderProps: any) => {
        const vr = rlvRef.current?.['_virtualRenderer'];
        const lm: any = vr?.['_layoutManager'];
        const layouts: any = lm?.['_layouts'];

        if (vr && (!ClsInstance.getLayouts() || layouts.length !== ClsInstance.getLayouts().length)) {
            ClsInstance.setLayouts(layouts);
            if (!layoutsReady.current) {
                layoutsReady.current = true;
                onLayoutsReady();
            }
        }

        return rowRenderer(type, data, index, { parentContext: ClsInstance, index }, renderProps);
    };

    const onLayoutsReady = () => {
        if (ClsInstance.getInitialRenderIndex()) {
            ClsInstance.scrollToInitialRenderIndex();
        }
    };

    useEffect(() => {
        CoreManager.registerFocusable(ClsInstance, scrollViewRef);

        return () => {
            CoreManager.removeFocusable(ClsInstance);
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
                    scrollEventThrottle: 320,
                }}
                onScroll={(event: any) => {
                    const { height } = event.nativeEvent.contentSize;
                    const { height: scrollContentHeight } = event.nativeEvent.layoutMeasurement;
                    const { y, x } = event.nativeEvent.contentOffset;

                    ClsInstance.setScrollOffsetY(y)
                        .setScrollOffsetX(x)
                        .updateLayoutProperty('yMaxScroll', height)
                        .updateLayoutProperty('scrollContentHeight', scrollContentHeight);

                    ClsInstance.recalculateChildrenLayouts(ClsInstance);
                }}
                rowRenderer={rowRendererWithProps}
                disableItemContainer={disableItemContainer}
                isHorizontal={isHorizontal}
                contentContainerStyle={contentContainerStyle}
                renderAheadOffset={1000}
                {...props}
            />
        </RNView>
    );
}

export { RecyclableListDataProvider, RecyclableListLayoutProvider, Column };

import React, { useEffect, useRef, useState } from 'react';
import { View as RNView } from 'react-native';
import { FlashList as FlashListComp } from '@shopify/flash-list';
import CoreManager from '../../focusManager/model/core';
import { measureAsync } from '../../focusManager/layoutManager';

import Grid from '../../focusManager/model/grid';
import List from '../../focusManager/model/list';
import Row from '../../focusManager/model/row';
import { FlashListProps } from '../../focusManager/types';

const FlashList = ({
    style,
    scrollViewProps,
    parentContext,
    isHorizontal = true,
    rowRenderer,
    repeatContext,
    focusOptions = {},
    type,
    initialRenderIndex,
    data,
    onFocus = () => {
        return null;
    },
    onBlur = () => {
        return null;
    },
    ...props
}: FlashListProps) => {
    const layoutsReady = useRef(false);
    const scrollViewRef = useRef<HTMLDivElement | null>();
    const rlvRef = useRef<FlashListComp<any>>(null);
    const rnViewRef = useRef<RNView>(null);

    const pctx = repeatContext?.parentContext || parentContext;

    const [measured, setMeasured] = useState(false);
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

    useEffect(() => {
        if (measured) {
            CoreManager.registerFocusable(ClsInstance, scrollViewRef);
        }

        return () => {
            CoreManager.removeFocusable(ClsInstance);
        };
    }, [measured]);

    const rowRendererWithProps = (props: any) => {
        //@ts-ignore
        const lm = rlvRef.current?.state?.layoutProvider?._lastLayoutManager;
        const layouts: any = lm?.['_layouts'];

        if (layouts && (!ClsInstance.getLayouts() || layouts.length !== ClsInstance.getLayouts().length)) {
            ClsInstance.setLayouts(layouts);
            if (!layoutsReady.current) {
                layoutsReady.current = true;
                onLayoutsReady();
            }
        }

        return rowRenderer(props, { parentContext: ClsInstance, index: props.index });
    };

    const onLayoutsReady = () => {
        if (ClsInstance.getInitialRenderIndex()) {
            ClsInstance.scrollToInitialRenderIndex();
        }
    };

    const onLayout = async () => {
        await measureAsync(ClsInstance, rnViewRef);
        setMeasured(true);
    };

    return (
        <RNView ref={rnViewRef} onLayout={onLayout} style={style}>
            {measured && (
                <FlashListComp
                    ref={rlvRef}
                    data={data}
                    renderItem={rowRendererWithProps}
                    estimatedItemSize={200}
                    horizontal={isHorizontal}
                    {...props}
                    overrideProps={{
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
                />
            )}
        </RNView>
    );
};

export default FlashList;

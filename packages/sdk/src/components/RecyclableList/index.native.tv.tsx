import React, { useEffect, useRef, useState } from 'react';
import { View as RNView } from 'react-native';
import {
    DataProvider as RecyclableListDataProvider,
    LayoutProvider as RecyclableListLayoutProvider,
    RecyclerListView,
} from '../../recyclerListView';
import CoreManager from '../../focusManager/core';
import { alterForbiddenFocusDirections, makeid, mergeStyles } from '../..//focusManager/helpers';
import { measure } from '../../focusManager/layoutManager';
import type { Context, RecyclerViewProps } from '../../focusManager/types';

export default function RecyclerView({
    style,
    parentContext,
    isHorizontal = true,
    rowRenderer,
    scrollViewProps,
    dataProvider,
    repeatContext,
    contentContainerStyle,
    focusOptions = {},
    ...props
}: RecyclerViewProps) {
    const scrollViewRef = useRef<HTMLDivElement | null>(null);
    const rlvRef = useRef<RecyclerListView<any, any>>(null);
    const rnViewRef = useRef<RNView>(null);
    const [context] = useState(() => {
        const ctx: Context = {
            id: `recycler-${makeid(8)}`,
            children: [],
            isFocusable: false,
            isScrollable: true,
            isNested: !!repeatContext,
            isRecyclable: true,
            scrollOffsetX: 0,
            scrollOffsetY: 0,
            type: 'recycler',
            isHorizontal,
            parent: parentContext,
            repeatContext,
            forbiddenFocusDirections: alterForbiddenFocusDirections(focusOptions.forbiddenFocusDirections),
        };

        return ctx;
    });

    if (repeatContext) {
        context.repeatContext = repeatContext;
    }

    const rowRendererWithProps = (type: any, data: any, index: any) => {
        const vr = rlvRef.current?.['_virtualRenderer'];
        if (vr && !context.layouts) {
            const lm: any = vr['_layoutManager'];
            const layouts: any = lm['_layouts'];
            context.layouts = layouts;
        }

        if (vr?.['_params'] && !context.isLastVisible) {
            const recyclerItemsCount = vr['_params'].itemCount;
            const vt: any = vr['_viewabilityTracker'] || {};

            context.isLastVisible = () => {
                const visibleIndexes = vt['_visibleIndexes'];
                return visibleIndexes[visibleIndexes.length - 1] + 1 === recyclerItemsCount;
            };

            context.isFirstVisible = () => {
                const visibleIndexes = vt['_visibleIndexes'];
                return visibleIndexes[0] === 0;
            };
        }

        return rowRenderer(type, data, index, { parentContext: context, index });
    };

    useEffect(() => {
        CoreManager.registerContext(context, scrollViewRef);
    });

    useEffect(() => {
        return () => {
            CoreManager.removeContext(context);
        };
    }, []);

    const onLayout = () => {
        measure(context, rnViewRef, mergeStyles(style, contentContainerStyle));
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

export { RecyclableListDataProvider, RecyclableListLayoutProvider };

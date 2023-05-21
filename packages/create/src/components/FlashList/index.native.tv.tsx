import React, { useEffect, useRef, useState } from 'react';
import { View as RNView } from 'react-native';
import { FlashList as FlashListComp, ListRenderItemInfo } from '@flexn/shopify-flash-list';

import Grid from '../../focusManager/model/grid';
import List from '../../focusManager/model/list';
import Row from '../../focusManager/model/row';
import { FlashListProps } from '../../focusManager/types';
import useOnLayout from '../../hooks/useOnLayout';
import useOnRefChange from '../../hooks/useOnRefChange';
import useFocusAwareComponentRegister from '../../hooks/useOnComponentLifeCycle';
import Event, { EVENT_TYPES } from '../../focusManager/events';

const FlashList = ({
    style,
    scrollViewProps,
    focusContext,
    horizontal = true,
    renderItem,
    focusRepeatContext,
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
}: FlashListProps<any>) => {
    const [measured, setMeasured] = useState(false);

    const scrollViewRef = useRef<HTMLDivElement | null>();
    const rlvRef = useRef<FlashListComp<any>>(null);

    const [model] = useState<List | Grid | Row>(() => {
        const params = {
            isHorizontal: horizontal,
            isNested: !!focusRepeatContext,
            //@ts-ignore
            parent: focusRepeatContext?.focusContext || focusContext,
            focusRepeatContext,
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

    useFocusAwareComponentRegister({ model, measured });

    const { onRefChange } = useOnRefChange(model);

    const { onLayout } = useOnLayout(model);

    useEffect(() => {
        const unsubscribe = Event.subscribe(model, EVENT_TYPES.ON_LAYOUT_MEASURE_COMPLETED, () => {
            setMeasured(true);
        });

        return () => unsubscribe();
    }, []);

    const rowRendererWithProps = ({ item, index, target }: ListRenderItemInfo<any>) => {
        const lm = rlvRef.current?.state?.layoutProvider.getLayoutManager();
        const layouts: { x: number; y: number }[] | undefined = lm?.getLayouts();

        model.updateLayouts(layouts);

        return renderItem?.({
            item,
            index,
            target,
            focusRepeatContext: { focusContext: model, index },
        });
    };

    return (
        <RNView ref={onRefChange} onLayout={onLayout} style={style}>
            {measured && (
                <FlashListComp
                    ref={rlvRef}
                    data={data}
                    renderItem={rowRendererWithProps}
                    horizontal={horizontal}
                    {...props}
                    overrideProps={{
                        ...scrollViewProps,
                        ref: (ref: any) => {
                            // eslint-disable-next-line no-underscore-dangle
                            scrollViewRef.current = ref?._scrollViewRef; // `scrollTo()` is not working otherwise
                            if (model.getNode().current) {
                                //@ts-ignore
                                model.getNode().current.scrollTo = ref?._scrollViewRef.scrollTo;
                            }
                        },
                        scrollEnabled: false,
                        scrollEventThrottle: 320,
                    }}
                    onScroll={(event: any) => {
                        const { height } = event.nativeEvent.contentSize;
                        const { height: scrollContentHeight } = event.nativeEvent.layoutMeasurement;
                        const { y, x } = event.nativeEvent.contentOffset;

                        model
                            .setScrollOffsetY(y)
                            .setScrollOffsetX(x)
                            .updateLayoutProperty('yMaxScroll', height)
                            .updateLayoutProperty('scrollContentHeight', scrollContentHeight);

                        model.recalculateChildrenLayouts(model);
                    }}
                />
            )}
        </RNView>
    );
};

export default FlashList;

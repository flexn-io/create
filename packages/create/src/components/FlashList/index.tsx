import React, { ForwardedRef, useEffect, useRef, useState } from 'react';
import { Platform, View as RNView } from 'react-native';
import { FlashList as FlashListComp, ListRenderItemInfo, CellContainer } from '@flexn/shopify-flash-list';
import BaseScrollComponent from '@flexn/recyclerlistview/dist/reactnative/core/scrollcomponent/BaseScrollComponent';
import { isSmartTV } from 'react-device-detect';
import Grid from '../../focusManager/model/grid';
import Row from '../../focusManager/model/row';
import { FlashListProps, CellContainerProps } from '../../focusManager/types';
import useOnLayout from '../../hooks/useOnLayout';
import useOnRefChange from '../../hooks/useOnRefChange';
import { useCombinedRefs } from '../../hooks/useCombinedRef';
import useFocusAwareComponentRegister from '../../hooks/useOnComponentLifeCycle';
import Event, { EVENT_TYPES } from '../../focusManager/events';
import { Ratio } from '../../helpers';
import View from '../../focusManager/model/view';

const FlashList = (props: FlashListProps<any>) => {
    const isNativeMobile = (Platform.OS === 'android' || Platform.OS === 'ios') && !Platform.isTV;
    // const isWeb = Platform.OS === 'web' && !isSmartTV;

    if (isNativeMobile) {
        return <FlashListComp {...props} />;
    }

    const {
        style,
        scrollViewProps,
        focusContext,
        horizontal = true,
        renderItem,
        focusOptions = {},
        type,
        initialRenderIndex,
        data,
        estimatedItemSize,
        onFocus = () => {
            return null;
        },
        onBlur = () => {
            return null;
        },
        ...restProps
    } = props;

    const [measured, setMeasured] = useState(false);

    const scrollViewRef = useRef<BaseScrollComponent | null>();

    // `any` is the type of data. Since we don't know data type here we're using any
    const rlvRef = useRef<FlashListComp<any> | null>(null);

    const [model] = useState<Grid | Row>(() => {
        const params = {
            horizontal,
            focusContext,
            initialRenderIndex,
            onFocus,
            onBlur,
            ...focusOptions,
        };

        if (type === 'grid') {
            return new Grid(params);
        } else {
            return new Row(params);
        }
    });

    useFocusAwareComponentRegister({ model, measured });

    const { onRefChange } = useOnRefChange(model);

    const { onLayout } = useOnLayout(model);

    useEffect(() => {
        const unsubscribe = Event.subscribe(
            model.getType(),
            model.getId(),
            EVENT_TYPES.ON_LAYOUT_MEASURE_COMPLETED,
            () => {
                setMeasured(true);
            }
        );

        return () => unsubscribe();
    }, []);

    const rowRendererWithProps = ({ item, index, target }: ListRenderItemInfo<any>) => {
        const lm = rlvRef.current?.state?.layoutProvider.getLayoutManager();
        const layouts: { x: number; y: number; width: number; height: number }[] | undefined = lm?.getLayouts();

        model.updateLayouts(layouts);

        return renderItem?.({
            item,
            index,
            target,
            focusRepeatContext: { focusContext: model, index },
        });
    };

    const ItemContainer = React.forwardRef((props: CellContainerProps, ref: ForwardedRef<any>) => {
        const target = useCombinedRefs<RNView>({ refs: [ref], model: null });

        useEffect(() => {
            const eventFocus = Event.subscribe(
                model.getType(),
                model.getId(),
                EVENT_TYPES.ON_CELL_CONTAINER_FOCUS,
                (index) => {
                    if (index === props.index) {
                        target.current?.setNativeProps({ zIndex: 1 });
                    }
                }
            );
            const eventBlur = Event.subscribe(
                model.getType(),
                model.getId(),
                EVENT_TYPES.ON_CELL_CONTAINER_BLUR,
                (index) => {
                    if (index === props.index) {
                        target.current?.setNativeProps({ zIndex: 0 });
                    }
                }
            );

            return () => {
                eventFocus();
                eventBlur();
            };
        }, [props.index]);

        return <CellContainer ref={target} {...props} />;
    });

    return (
        <RNView ref={onRefChange} onLayout={onLayout} style={style}>
            {measured && (
                <FlashListComp
                    ref={(ref) => {
                        if (ref) {
                            rlvRef.current = ref;
                            if (ref.recyclerlistview_unsafe) {
                                ref.recyclerlistview_unsafe.setScrollComponent(
                                    scrollViewRef.current as BaseScrollComponent
                                );
                            }
                        }
                    }}
                    data={data}
                    renderItem={rowRendererWithProps}
                    horizontal={horizontal}
                    estimatedItemSize={estimatedItemSize ? Math.round(estimatedItemSize) : undefined}
                    {...restProps}
                    contentContainerStyle={{
                        ...restProps.contentContainerStyle,
                        // TODO: Needs to be calculated
                        ...(focusOptions.autoLayoutScaleAnimation && {
                            paddingHorizontal: Ratio(focusOptions.autoLayoutSize || 0),
                            paddingVertical: Ratio(focusOptions.autoLayoutSize || 0),
                        }),
                    }}
                    onItemLayout={(index) => {
                        // Initial layout can change we need to ensure that every change is instantly remeasured
                        const children = model
                            .getChildren()
                            .find((ch) => ch instanceof View && ch.getRepeatContext()?.index === index);

                        if (children) {
                            model.remeasureSelfAndChildrenLayouts(children);
                        }
                    }}
                    CellRendererComponent={ItemContainer}
                    overrideProps={{
                        ...scrollViewProps,
                        ref: (ref: BaseScrollComponent) => {
                            scrollViewRef.current = ref;

                            if (model.getNode()?.current) {
                                //@ts-expect-error mystery which needs to be resolved from recyclerlistview perspective
                                model.getNode().current.scrollTo = ref?._scrollViewRef?.scrollTo;
                            }
                        },
                        scrollEnabled: false,
                        scrollEventThrottle: 320,
                    }}
                    onScroll={(event) => {
                        const { height } = event.nativeEvent.contentSize;
                        const { height: scrollContentHeight } = event.nativeEvent.layoutMeasurement;
                        const { y, x } = event.nativeEvent.contentOffset;
                        const endY = scrollContentHeight + y >= height;

                        if (model.getScrollTargetY() === y || endY) {
                            model.setIsScrollingVertically(false);
                        } else {
                            model.setIsScrollingVertically(true);
                        }

                        model
                            .setScrollOffsetY(y)
                            .setScrollOffsetX(x)
                            .updateLayoutProperty('yMaxScroll', height)
                            .updateLayoutProperty('scrollContentHeight', scrollContentHeight);

                        model.recalculateChildrenAbsoluteLayouts(model);
                    }}
                />
            )}
        </RNView>
    );
};

export default FlashList;

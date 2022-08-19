import React, { useState, useRef, useEffect } from 'react';
import { StyleProp, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import { isPlatformTvos } from '@rnv/renative';
import Text from '../../components/Text';
import View from '../../components/View';
import RecyclableList, {
    RecyclableListLayoutProvider,
    RecyclableListDataProvider,
} from '../../components/RecyclableList';
import { Ratio } from '../../helpers';
import { Context, RecyclableListFocusOptions } from '../../focusManager/types';
import { PosterCard } from '../Card';
import useDimensionsCalculator from '../../hooks/useDimensionsCalculator';

type RowItem = {
    backgroundImage: string;
    title?: string;
};
interface RowProps {
    index?: number;
    parentContext?: Context;
    repeatContext?: Context;
    title?: string;
    focusOptions?: RecyclableListFocusOptions;
    animatorOptions?: any;
    itemsInViewport: number;
    style?: StyleProp<ViewStyle>;
    cardStyle?: StyleProp<ViewStyle> | StyleProp<TextStyle>;
    titleStyle?: StyleProp<TextStyle>;
    onFocus?(data: any): void;
    onBlur?(data: any): void;
    onPress?(data: any): void;
    renderCard?(data: any, _repeatContext: any, dimensions: any, _renderProps: any): JSX.Element | JSX.Element[] | null;
    items: RowItem[];
    rerenderData?: any;
    itemDimensions: { height: number };
    itemSpacing?: number;
    verticalItemSpacing?: number;
    horizontalItemSpacing?: number;
    initialXOffset?: number;
    disableItemContainer?: boolean;
}

const Row = ({
    items,
    title,
    itemsInViewport,
    parentContext,
    repeatContext,
    focusOptions,
    animatorOptions,
    style = {},
    cardStyle = {},
    titleStyle = {},
    rerenderData,
    onFocus,
    onPress,
    onBlur,
    renderCard,
    itemDimensions,
    itemSpacing = 30,
    verticalItemSpacing = 0,
    horizontalItemSpacing = 0,
    initialXOffset = 0,
    disableItemContainer = false,
}: RowProps) => {
    const ref: any = useRef();
    const layoutProvider: any = useRef();
    const dataProviderInstance = useRef(new RecyclableListDataProvider((r1, r2) => r1 !== r2)).current;
    const [dataProvider, setDataProvider] = useState(dataProviderInstance.cloneWithRows(items));
    const flattenTitleStyles = StyleSheet.flatten(titleStyle);
    const { boundaries, isLoading, spacings, onLayout, rowDimensions } = useDimensionsCalculator({
        style,
        initialXOffset,
        itemSpacing,
        verticalItemSpacing,
        horizontalItemSpacing,
        itemDimensions,
        itemsInViewport,
        ref,
    });

    useEffect(() => {
        setDataProvider(dataProviderInstance.cloneWithRows(items));
    }, [rerenderData]);

    const setLayoutProvider = () => {
        if (!isLoading && !layoutProvider.current) {
            layoutProvider.current = new RecyclableListLayoutProvider(
                () => '_',
                (_: string | number, dim: { width: number; height: number }) => {
                    dim.width = rowDimensions.layout.width;
                    dim.height = rowDimensions.layout.height;
                }
            );
        }
    };

    setLayoutProvider();

    const rowRenderer = (_type: string | number, data: any, _index: number, _repeatContext: any, _renderProps: any) => {
        if (renderCard) {
            return renderCard(data, _repeatContext, { ...rowDimensions.item }, _renderProps);
        }
        return (
            <PosterCard
                src={{ uri: data.backgroundImage }}
                title={data.title}
                style={[cardStyle, { width: rowDimensions.item.width, height: rowDimensions.item.height }]}
                onFocus={() => onFocus?.(data)}
                onBlur={() => onBlur?.(data)}
                onPress={() => onPress?.(data)}
                repeatContext={_repeatContext}
                renderProps={_renderProps}
                focusOptions={{
                    animatorOptions,
                }}
            />
        );
    };

    const renderRecycler = () => {
        if (!isLoading) {
            return (
                <RecyclableList
                    type="row"
                    dataProvider={dataProvider}
                    layoutProvider={layoutProvider.current}
                    initialXOffset={Ratio(initialXOffset)}
                    repeatContext={repeatContext}
                    rowRenderer={rowRenderer}
                    disableItemContainer={disableItemContainer && isPlatformTvos}
                    isHorizontal
                    style={[{ width: boundaries.width, height: boundaries.height }]}
                    contentContainerStyle={{ ...spacings }}
                    scrollViewProps={{
                        showsHorizontalScrollIndicator: false,
                    }}
                    focusOptions={focusOptions}
                    unmeasurableRelativeDimensions={{
                        y: flattenTitleStyles?.fontSize || 0,
                        x: 0,
                    }}
                />
            );
        }

        return null;
    };

    const renderTitle = () => {
        if (title) {
            return <Text style={[{ left: spacings.paddingLeft }, titleStyle]}>{title}</Text>;
        }

        return null;
    };

    return (
        <View parentContext={parentContext} style={style} onLayout={onLayout} ref={ref}>
            {renderTitle()}
            {renderRecycler()}
        </View>
    );
};

export default Row;

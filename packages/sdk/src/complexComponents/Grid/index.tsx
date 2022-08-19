import React, { useState, useRef, useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { isPlatformTvos } from '@rnv/renative';
import View from '../../components/View';
import RecyclableList, {
    RecyclableListDataProvider,
    RecyclableListLayoutProvider,
} from '../../components/RecyclableList';
import { PosterCard } from '../Card';
import useDimensionsCalculator from '../../hooks/useDimensionsCalculator';
import { Context, RecyclableListFocusOptions } from '../../focusManager/types';

type RowItem = {
    backgroundImage: string;
    title?: string;
};

interface GridProps {
    parentContext?: Context;
    focusOptions?: RecyclableListFocusOptions;
    itemsInViewport: number;
    style?: StyleProp<ViewStyle>;
    cardStyle?: StyleProp<ViewStyle>;
    onFocus?(data: any): void;
    onBlur?(data: any): void;
    onPress?(data: any): void;
    renderCard?(data: any, _repeatContext: any, dimensions: any, _renderProps: any): JSX.Element | JSX.Element[] | null;
    items: RowItem[];
    itemDimensions: { height: number };
    itemSpacing?: number;
    verticalItemSpacing?: number;
    horizontalItemSpacing?: number;
    rerenderData?: any;
    animatorOptions?: any;
    disableItemContainer?: boolean;
}

const Grid = ({
    items,
    style = {},
    cardStyle = {},
    itemSpacing = 30,
    verticalItemSpacing = 0,
    horizontalItemSpacing = 0,
    itemDimensions,
    itemsInViewport = 5,
    parentContext,
    focusOptions,
    rerenderData,
    animatorOptions,
    onFocus,
    onPress,
    onBlur,
    renderCard,
    disableItemContainer = false,
}: GridProps) => {
    const ref: any = useRef();
    const layoutProvider: any = useRef();
    const dataProviderInstance = useRef(new RecyclableListDataProvider((r1, r2) => r1 !== r2)).current;
    const [dataProvider, setDataProvider] = useState(dataProviderInstance.cloneWithRows(items));
    const { boundaries, spacings, onLayout, rowDimensions, isLoading } = useDimensionsCalculator({
        style,
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

    const renderGrid = () => (
        <RecyclableList
            type="grid"
            dataProvider={dataProvider}
            layoutProvider={layoutProvider.current}
            rowRenderer={(_type: string | number, data, _index: number, repeatContext: any, renderProps) => {
                if (renderCard) {
                    return renderCard(data, repeatContext, { ...rowDimensions.item }, renderProps);
                }
                return (
                    <PosterCard
                        src={{ uri: data.backgroundImage }}
                        title={data.title}
                        style={[cardStyle, { width: rowDimensions.item.width, height: rowDimensions.item.height }]}
                        onFocus={() => onFocus?.(data)}
                        onPress={() => onPress?.(data)}
                        onBlur={() => onBlur?.(data)}
                        repeatContext={repeatContext}
                        renderProps={renderProps}
                        focusOptions={{ animatorOptions }}
                    />
                );
            }}
            style={[{ width: boundaries.width, height: boundaries.relativeHeight }]}
            contentContainerStyle={{ ...spacings }}
            scrollViewProps={{
                showsHorizontalScrollIndicator: false,
            }}
            focusOptions={focusOptions}
            isHorizontal={false}
            disableItemContainer={disableItemContainer && isPlatformTvos}
        />
    );

    return (
        <View parentContext={parentContext} style={style} onLayout={onLayout} ref={ref}>
            {!isLoading && renderGrid()}
        </View>
    );
};

Grid.displayName = 'Grid';

export default Grid;

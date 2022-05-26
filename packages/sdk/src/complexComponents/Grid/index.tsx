import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
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
    items: RowItem[];
    itemDimensions: { height: number };
    itemSpacing?: number;
    rerenderData?: any;
}

const Grid = ({
    items,
    style = {},
    cardStyle = {},
    itemSpacing = 30,
    itemDimensions,
    itemsInViewport = 5,
    parentContext,
    focusOptions,
    rerenderData,
    onFocus,
    onPress,
    onBlur,
}: GridProps) => {
    const ref: any = useRef();
    const layoutProvider: any = useRef();
    const dataProviderInstance = useRef(new RecyclableListDataProvider((r1, r2) => r1 !== r2)).current;
    const [dataProvider, setDataProvider] = useState(dataProviderInstance.cloneWithRows(items));
    const { boundaries, spacings, onLayout, rowDimensions } = useDimensionsCalculator({
        style,
        itemSpacing,
        itemDimensions,
        itemsInViewport,
        ref,
    });

    useEffect(() => {
        if (rerenderData) {
            setDataProvider(dataProviderInstance.cloneWithRows(items));
        }
    }, [rerenderData]);

    const updateLayoutProvider = useCallback(() => {
        layoutProvider.current = new RecyclableListLayoutProvider(
            () => '_',
            (_: string | number, dim: { width: number; height: number }) => {
                dim.width = rowDimensions.layout.width;
                dim.height = rowDimensions.layout.height;
            }
        );
    }, [rowDimensions]);

    updateLayoutProvider();

    const renderGrid = () => (
        <RecyclableList
            dataProvider={dataProvider}
            layoutProvider={layoutProvider.current}
            rowRenderer={(_type: string | number, data, _index: number, repeatContext: any) => {
                return (
                    <PosterCard
                        src={{ uri: data.backgroundImage }}
                        title={data.title}
                        style={[cardStyle, { width: rowDimensions.item.width, height: rowDimensions.item.height }]}
                        onFocus={() => onFocus?.(data)}
                        onPress={() => onPress?.(data)}
                        onBlur={() => onBlur?.(data)}
                        repeatContext={repeatContext}
                    />
                );
            }}
            style={[style, { width: boundaries.width, height: boundaries.relativeHeight }]}
            contentContainerStyle={{ ...spacings }}
            scrollViewProps={{
                showsHorizontalScrollIndicator: false,
            }}
            focusOptions={focusOptions}
            isHorizontal={false}
        />
    );

    return (
        <View parentContext={parentContext} style={baseStyles.container} onLayout={onLayout} ref={ref}>
            {renderGrid()}
        </View>
    );
};

const baseStyles = {
    container: {
        flex: 1,
    },
};

Grid.displayName = 'Grid';

export default Grid;

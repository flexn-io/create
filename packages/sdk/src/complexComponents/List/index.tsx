import React, { useState, useRef, useEffect } from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import View from '../../components/View';
import RecyclableList, {
    RecyclableListLayoutProvider,
    RecyclableListDataProvider,
} from '../../components/RecyclableList';
import Carousel from '../Row';
import { Ratio } from '../../helpers';
import useDimensionsCalculator from '../../hooks/useDimensionsCalculator';
import { Context, RecyclableListFocusOptions } from '../../focusManager/types';

type RowItem = {
    backgroundImage: string;
    title?: string;
};
interface ListProps {
    parentContext?: Context;
    focusOptions?: RecyclableListFocusOptions;
    animatorOptions?: any;
    itemsInViewport?: number;
    style?: StyleProp<ViewStyle>;
    cardStyle?: StyleProp<ViewStyle> | StyleProp<TextStyle>;
    titleStyle?: StyleProp<TextStyle>;
    onFocus?(data: any): void;
    onBlur?(data: any): void;
    onPress?(data: any): void;
    renderCard?(data: any, _repeatContext: any, dimensions: any, _renderProps: any): JSX.Element | JSX.Element[] | null;
    items: {
        rowTitle?: string;
        itemsInViewport?: number;
        items: RowItem[][];
    }[];
    itemDimensions: { height: number };
    itemSpacing?: number;
    verticalItemSpacing?: number;
    horizontalItemSpacing?: number;
    initialXOffset?: number;
    rowHeight: number;
    rerenderData?: any;
    disableItemContainer?: boolean;
}

const List = ({
    parentContext,
    items,
    itemsInViewport = 5,
    style = {},
    cardStyle = {},
    titleStyle = {},
    rerenderData,
    focusOptions,
    animatorOptions,
    itemSpacing = 30,
    verticalItemSpacing = 0,
    horizontalItemSpacing = 0,
    itemDimensions,
    onPress,
    onFocus,
    onBlur,
    renderCard,
    initialXOffset = 0,
    rowHeight,
    disableItemContainer = false,
}: ListProps) => {
    const ref: any = useRef();
    const layoutProvider: any = useRef();
    const [rowRendererData, setRowRendererData] = useState();
    const dataProviderInstance = useRef(new RecyclableListDataProvider((r1, r2) => r1 !== r2)).current;
    const [dataProvider, setDataProvider] = useState(dataProviderInstance.cloneWithRows(items));

    const { boundaries, onLayout } = useDimensionsCalculator({
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
        setRowRendererData(rerenderData);
    }, [rerenderData]);

    const setLayoutProvider = () => {
        if (!layoutProvider.current) {
            layoutProvider.current = new RecyclableListLayoutProvider(
                () => '_',
                (_: string | number, dim: { width: number; height: number }) => {
                    dim.width = boundaries.width;
                    dim.height = Ratio(rowHeight);
                }
            );
        }
    };

    setLayoutProvider();

    const renderRow = ({ index, data, title, repeatContext }: any) => {
        return (
            <Carousel
                key={index}
                items={data.items}
                itemsInViewport={data.itemsInViewport || itemsInViewport}
                title={title}
                onPress={onPress}
                onFocus={onFocus}
                onBlur={onBlur}
                renderCard={renderCard}
                repeatContext={repeatContext}
                style={{
                    width: boundaries.width,
                    height: Ratio(rowHeight),
                }}
                cardStyle={cardStyle}
                titleStyle={titleStyle}
                itemDimensions={itemDimensions}
                itemSpacing={itemSpacing}
                initialXOffset={initialXOffset}
                animatorOptions={animatorOptions}
                disableItemContainer={disableItemContainer}
                // TODO: This should be not needed eventually
                focusOptions={{
                    nextFocusLeft: focusOptions?.nextFocusLeft,
                    nextFocusRight: focusOptions?.nextFocusRight,
                }}
                rerenderData={rowRendererData}
            />
        );
    };

    const renderRecycler = () => {
        return (
            <RecyclableList
                parentContext={parentContext}
                type="list"
                isHorizontal={false}
                scrollViewProps={{
                    showsVerticalScrollIndicator: false,
                }}
                style={[{ width: boundaries.width, height: boundaries.height }]}
                dataProvider={dataProvider}
                layoutProvider={layoutProvider.current}
                rowRenderer={(_type: string | number, rowData: any, index: number, repeatContext: any) => {
                    return renderRow({
                        index,
                        data: rowData,
                        title: rowData.rowTitle,
                        nestedParentContext: repeatContext?.parentContext,
                        repeatContext: repeatContext,
                    });
                }}
                focusOptions={focusOptions}
            />
        );
    };

    return (
        <View parentContext={parentContext} style={style} onLayout={onLayout} ref={ref}>
            {renderRecycler()}
        </View>
    );
};

export default List;

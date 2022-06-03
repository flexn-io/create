import React, { useState, useRef, useCallback, useEffect } from 'react';
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
    items: {
        rowTitle?: string;
        itemsInViewport?: number;
        items: RowItem[][];
    }[];
    itemDimensions: { height: number };
    itemSpacing?: number;
    initialXOffset?: number;
    rowHeight: number;
    rerenderData?: any;
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
    itemDimensions,
    onPress,
    initialXOffset = 0,
    rowHeight,
}: ListProps) => {
    const ref: any = useRef();
    const layoutProvider: any = useRef();
    const [rowRendererData, setRowRendererData] = useState();
    const dataProviderInstance = useRef(new RecyclableListDataProvider((r1, r2) => r1 !== r2)).current;
    const [dataProvider, setDataProvider] = useState(dataProviderInstance.cloneWithRows(items));

    const { boundaries, onLayout } = useDimensionsCalculator({
        style,
        itemSpacing,
        itemDimensions,
        itemsInViewport,
        ref,
    });

    useEffect(() => {
        if (rerenderData) {
            setDataProvider(dataProviderInstance.cloneWithRows(items));
            setRowRendererData(rerenderData);
        }
    }, [rerenderData]);

    const updateLayoutProvider = useCallback(() => {
        layoutProvider.current = new RecyclableListLayoutProvider(
            () => '_',
            (_: string | number, dim: { width: number; height: number }) => {
                dim.width = boundaries.width;
                dim.height = Ratio(rowHeight);
            }
        );
    }, [boundaries]);

    updateLayoutProvider();

    const renderRow = ({ index, data, title, repeatContext, nestedParentContext }: any) => {
        return (
            <Carousel
                index={index}
                items={data.items}
                itemsInViewport={data.itemsInViewport || itemsInViewport}
                title={title}
                onPress={onPress}
                repeatContext={repeatContext}
                nestedParentContext={nestedParentContext}
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
                focusOptions={focusOptions}
                rerenderData={rowRendererData}
            />
        );
    };

    const renderRecycler = () => {
        return (
            <RecyclableList
                isHorizontal={false}
                scrollViewProps={{
                    showsVerticalScrollIndicator: false,
                }}
                style={[style, { width: boundaries.width, height: boundaries.height }]}
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
        <View parentContext={parentContext} style={styles.container} onLayout={onLayout} ref={ref}>
            {renderRecycler()}
        </View>
    );
};

const styles = {
    container: {},
};

export default List;

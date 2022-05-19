import React, { useState, useRef, useCallback } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import View from '../../components/View';
import RecyclableList, {
    RecyclableListLayoutProvider,
    RecyclableListDataProvider,
} from '../../components/RecyclableList';
import Carousel from '../Row';

import useDimensionsCalculator from '../../hooks/useDimensionsCalculator';
import { Context, RecyclableListFocusOptions } from '../../focusManager/types';

type RowItem = {
    backgroundImage: string;
    title?: string;
};
interface ListProps {
    parentContext?: Context;
    focusOptions?: RecyclableListFocusOptions;
    itemsInViewport: number;
    style?: StyleProp<ViewStyle>;
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
}

const List = ({
    parentContext,
    items,
    itemsInViewport = 5,
    style = {},
    focusOptions,
    itemSpacing = 30,
    itemDimensions,
    onPress,
    initialXOffset = 0,
    rowHeight,
}: ListProps) => {
    const ref: any = useRef();

    const { boundaries, onLayout } = useDimensionsCalculator({
        style,
        itemSpacing,
        itemDimensions,
        itemsInViewport,
        ref,
    });

    const [dataProvider] = useState(new RecyclableListDataProvider((r1, r2) => r1 !== r2).cloneWithRows(items));
    const layoutProvider: any = useRef();

    const updateLayoutProvider = useCallback(() => {
        layoutProvider.current = new RecyclableListLayoutProvider(
            () => '_',
            (_: string | number, dim: { width: number; height: number }) => {
                dim.width = boundaries.width;
                dim.height = rowHeight;
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
                    height: rowHeight,
                }}
                itemDimensions={itemDimensions}
                itemSpacing={itemSpacing}
                initialXOffset={initialXOffset}
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
                        nestedParentContext: repeatContext.parentContext,
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
    container: {
        flex: 1,
    },
};

export default List;

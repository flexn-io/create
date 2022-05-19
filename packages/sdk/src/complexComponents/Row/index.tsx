import React, { useState, useCallback, useRef } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import View from '../../components/View';
import RecyclableList, {
    RecyclableListLayoutProvider,
    RecyclableListDataProvider,
} from '../../components/RecyclableList';
import { Ratio } from '../../helpers';
import { Context, ForbiddenFocusDirections } from '../../focusManager/types';
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
    nestedParentContext?: Context;
    title?: string;
    forbiddenFocusDirections?: ForbiddenFocusDirections;
    itemsInViewport: number;
    style?: StyleProp<ViewStyle>;
    onFocus?(data: any): void;
    onBlur?(data: any): void;
    onPress?(data: any): void;
    items: RowItem[];
    itemDimensions: { height: number };
    itemSpacing?: number;
    initialXOffset?: number;
}

const Row = ({
    index,
    items,
    title,
    itemsInViewport,
    parentContext,
    repeatContext,
    nestedParentContext,
    forbiddenFocusDirections,
    style = {},
    onFocus,
    onPress,
    onBlur,
    itemDimensions,
    itemSpacing = 30,
    initialXOffset = 0,
}: RowProps) => {
    const ref: any = useRef();
    const layoutProvider: any = useRef();
    const [dataProvider] = useState(new RecyclableListDataProvider((r1, r2) => r1 !== r2).cloneWithRows(items));
    const { boundaries, spacings, onLayout, rowDimensions } = useDimensionsCalculator({
        style,
        itemSpacing,
        itemDimensions,
        itemsInViewport,
        ref,
    });

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

    const rowRenderer = (_type: string | number, data: any, _index: number, _repeatContext: any) => {
        return (
            <PosterCard
                src={{ uri: data.backgroundImage }}
                title={data.title}
                style={[{ width: rowDimensions.item.width, height: rowDimensions.item.height }]}
                onFocus={() => onFocus?.(data)}
                onBlur={() => onBlur?.(data)}
                onPress={() => onPress?.(data)}
                repeatContext={_repeatContext}
                focusOptions={{
                    initialFocus: index === 0 && _index === 0,
                }}
            />
        );
    };

    const renderRecycler = () => {
        return (
            <RecyclableList
                {...(index !== undefined && {
                    key: index,
                })}
                dataProvider={dataProvider}
                layoutProvider={layoutProvider.current}
                initialXOffset={Ratio(initialXOffset)}
                repeatContext={repeatContext}
                rowRenderer={rowRenderer}
                isHorizontal
                style={[style, { width: boundaries.width, height: boundaries.height }]}
                contentContainerStyle={{ ...spacings }}
                scrollViewProps={{
                    showsHorizontalScrollIndicator: false,
                }}
                focusOptions={{
                    forbiddenFocusDirections,
                }}
            />
        );
    };

    const renderTitle = () => {
        if (title) {
            // TODO: Render title
        }

        return null;
    };

    return (
        <View
            parentContext={nestedParentContext || parentContext}
            style={styles.container}
            onLayout={onLayout}
            ref={ref}
        >
            {renderRecycler()}
            {renderTitle()}
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
    },
};

export default Row;

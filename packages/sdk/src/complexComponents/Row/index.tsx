import React, { useState, useCallback, useRef, useEffect } from 'react';
import { StyleProp, ViewStyle, TextStyle, StyleSheet } from 'react-native';
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
    nestedParentContext?: Context;
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
    items: RowItem[];
    rerenderData?: any;
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
    parentClass,
    nestedParentClass,
    repeatClass,
    focusOptions,
    animatorOptions,
    style = {},
    cardStyle = {},
    titleStyle = {},
    rerenderData,
    onFocus,
    onPress,
    onBlur,
    itemDimensions,
    itemSpacing = 30,
    initialXOffset = 0,
}: RowProps) => {
    const ref: any = useRef();
    const layoutProvider: any = useRef();
    const dataProviderInstance = useRef(new RecyclableListDataProvider((r1, r2) => r1 !== r2)).current;
    const [dataProvider, setDataProvider] = useState(dataProviderInstance.cloneWithRows(items));
    const flattenTitleStyles = StyleSheet.flatten(titleStyle);
    const { boundaries, isLoading, spacings, onLayout, rowDimensions } = useDimensionsCalculator({
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

    const rowRenderer = (_type: string | number, data: any, _index: number, _repeatContext: any) => {
        return (
            <PosterCard
                src={{ uri: data.backgroundImage }}
                title={data.title}
                style={[cardStyle, { width: rowDimensions.item.width, height: rowDimensions.item.height }]}
                onFocus={() => onFocus?.(data)}
                onBlur={() => onBlur?.(data)}
                onPress={() => onPress?.(data)}
                repeatContext={_repeatContext}
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
                    {...(index !== undefined && {
                        key: index,
                    })}
                    dataProvider={dataProvider}
                    layoutProvider={layoutProvider.current}
                    initialXOffset={Ratio(initialXOffset)}
                    repeatContext={repeatContext}
                    repeatClass={repeatClass}
                    rowRenderer={rowRenderer}
                    isHorizontal
                    style={[style, { width: boundaries.width, height: boundaries.height }]}
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
        <View
            parentContext={nestedParentContext || parentContext}
            parentClass={nestedParentClass || parentClass}
            style={styles.container}
            onLayout={onLayout}
            ref={ref}
        >
            {renderTitle()}
            {renderRecycler()}
        </View>
    );
};

const styles = {
    container: {},
};

export default Row;

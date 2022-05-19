import React, { useState, useRef, useEffect } from 'react';
import { Dimensions } from 'react-native';

import Image from '../../components/Image';
import View from '../../components/View';
import Pressable from '../../components/Pressable';
import Text from '../../components/Text';
import StyleSheet from '../../apis/StyleSheet';
import { CardProps } from './types';
import { Ratio } from '../../helpers';
import RecyclableList, {
    RecyclableListDataProvider,
    RecyclableListLayoutProvider,
} from '../../components/RecyclableList';

import Card from '../Card';

const { width, height } = Dimensions.get('window');
const MARGIN_RECYCLER_SIDES = Ratio(0);
export function calculateDimensions(
    itemsInViewport: number,
    style: any,
    itemSpacing
): {
    layout: { width: number; height: number };
    item: { width: number; height: number };
} {
    let width2 = width;

    if (style.borderWidth) {
        width2 -= style.borderWidth * 2;
    }
    if (style.marginVertical) {
        width2 -= style.marginVertical * 2;
    }
    if (style.marginLeft) {
        width2 -= style.marginLeft;
    }
    if (style.marginRight) {
        width2 -= style.marginRight;
    }

    const actualWidth = width2 - MARGIN_RECYCLER_SIDES;
    console.log('itemsInViewport', width2, itemSpacing, itemsInViewport, actualWidth / itemsInViewport);
    return {
        layout: { width: actualWidth / itemsInViewport, height: Ratio(250) },
        item: { width: actualWidth / itemsInViewport - itemSpacing, height: Ratio(200) },
    };
}

const Grid = ({
    items,
    style = {},
    cardStyle,
    itemSpacing,
    itemsInViewport,
    parentContext,
    forbiddenFocusDirections,
    onFocus,
    onPress,
}) => {
    const { layout, item } = calculateDimensions(itemsInViewport, style, itemSpacing);
    const dataProviderInstance = new RecyclableListDataProvider((r1, r2) => r1 !== r2);
    const [dataProvider, setDataProvider] = useState(dataProviderInstance.cloneWithRows(items));
    const layoutProvider = useRef(
        new RecyclableListLayoutProvider(
            () => '_',
            (_: string | number, dim: { width: number; height: number }) => {
                dim.width = layout.width;
                dim.height = layout.height;
            }
        )
    ).current;

    useEffect(() => {
        setDataProvider(dataProviderInstance.cloneWithRows(items));
    }, [items]);

    const renderGrid = () => (
        <RecyclableList
            dataProvider={dataProvider}
            layoutProvider={layoutProvider}
            rowRenderer={(_type: string | number, data, _index: number, repeatContext: any) => {
                return (
                    <Card
                        src={{ uri: data.backgroundImage }}
                        style={[cardStyle, { width: item.width, height: item.height }]}
                        onFocus={onFocus}
                        onPress={onPress}
                        repeatContext={repeatContext}
                    />
                );
            }}
            style={[baseStyles.grid, style]}
            contentContainerStyle={baseStyles.gridContentContainerStyle}
            scrollViewProps={{
                showsHorizontalScrollIndicator: false,
            }}
            focusOptions={{
                forbiddenFocusDirections,
            }}
            isHorizontal={false}
        />
    );

    return (
        <View parentContext={parentContext} style={baseStyles.container}>
            {renderGrid()}
        </View>
    );
};

const baseStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    grid: {
        height,
        width,
    },
    gridContentContainerStyle: {
        left: 20,
        top: 20,
    },
});

Grid.displayName = 'Grid';

export default Grid;

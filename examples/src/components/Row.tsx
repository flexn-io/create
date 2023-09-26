import React from 'react';
import { ImageSourcePropType } from 'react-native';
import { FlashList, View, CreateListRenderItemInfo, StyleSheet, FocusContext, FlashListProps } from '@flexn/create';
import Item from './Item';
import type { Item as ItemType } from './Item';
import { Ratio } from '../utils';

type Props = {
    focusContext?: FocusContext;
    data: {
        thumbSrc: ImageSourcePropType;
        bgSrc: ImageSourcePropType;
    }[];
    onFocus: (item: ItemType) => void;
    onRowFocus: () => void;
    onRowBlur: () => void;
    focusOptions?: FlashListProps<any>['focusOptions'];
};

const Row = ({ focusContext, data, onFocus, focusOptions, onRowFocus, onRowBlur }: Props) => {
    const rowRenderer = ({ item, focusRepeatContext }: CreateListRenderItemInfo<any>) => {
        return <Item focusRepeatContext={focusRepeatContext} item={item} onFocus={onFocus} />;
    };

    return (
        <View style={styles.container} focusContext={focusContext}>
            <FlashList
                data={data}
                renderItem={rowRenderer}
                type="row"
                horizontal
                estimatedItemSize={Ratio(228)}
                focusOptions={{ autoLayoutScaleAnimation: true, autoLayoutSize: 30, ...focusOptions }}
                contentContainerStyle={
                    {
                        // paddingLeft: Ratio(230),
                    }
                }
                scrollViewProps={{
                    showsHorizontalScrollIndicator: false,
                }}
                onFocus={onRowFocus}
                onBlur={onRowBlur}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: Ratio(230),
    },
});

export default Row;

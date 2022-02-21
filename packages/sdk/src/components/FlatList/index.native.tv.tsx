import React from 'react';
import { FlatList as RNFlatList } from 'react-native';
import type { Context } from '../../focusManager/types';

const FlatList = React.forwardRef<RNFlatList, { renderItem: any; data: any; parentContext: Context }>(
    ({ renderItem, data, parentContext, ...props }, ref) => {
        const renderItemWithParentContext = ({
            index,
            item,
            separators,
        }: {
            index: number;
            item: any;
            separators: any;
        }) => {
            return renderItem({ index, item, separators, parentContext });
        };

        return <RNFlatList {...props} data={data} ref={ref} renderItem={renderItemWithParentContext} />;
    }
);

FlatList.displayName = 'FlatList';

export default FlatList;

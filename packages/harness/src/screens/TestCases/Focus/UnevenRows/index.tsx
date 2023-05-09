import {
    TouchableOpacity,
    RecyclableList,
    RecyclableListDataProvider,
    RecyclableListLayoutProvider,
    ScrollView,
    Text,
    View,
} from '@flexn/create';
import React, { useRef } from 'react';
import { getScaledValue } from '@rnv/renative';
import Screen from '../../../../components/Screen';
import { themeStyles } from '../../../../config';
import { testProps } from '../../../../utils';
import { UNEVEN_ROWS_ITEM_COUNTS } from './config';

const List = ({
    rowItemCount,
    rowIndex,
    parentContext,
}: {
    rowItemCount: number;
    rowIndex: number;
    parentContext?: any;
}) => {
    const dataProvider = useRef(
        new RecyclableListDataProvider((r1, r2) => r1 !== r2).cloneWithRows([...Array(rowItemCount).keys()])
    ).current;
    const layoutProvider = useRef(
        new RecyclableListLayoutProvider(
            () => '_',
            (type, dim) => {
                dim.width = getScaledValue(200);
                dim.height = getScaledValue(200);
            }
        )
    ).current;

    return (
        <View parentContext={parentContext}>
            <Text
                style={themeStyles.textH3}
                {...testProps(`flexn-screens-focus-uneven-row-${rowIndex}-item-count-${rowItemCount}`)}
            >
                {rowIndex + 1} row ({rowItemCount} items)
            </Text>
            <RecyclableList
                type="row"
                dataProvider={dataProvider}
                layoutProvider={layoutProvider}
                rowRenderer={(_type: string | number, _data: any, index: number, repeatContext: any) => (
                    <TouchableOpacity
                        focusOptions={{
                            animatorOptions: {
                                type: 'background_color',
                                colorBlur: '#008000',
                                colorFocus: '#FF002B',
                                // duration: 0.5
                            },
                        }}
                        repeatContext={repeatContext}
                        style={{
                            width: 200,
                            height: 200,
                            backgroundColor: 'green',
                            marginHorizontal: 25,
                        }}
                        {...testProps(`flexn-screens-focus-uneven-rows-flat-list-row-${rowIndex}-item-${index}`)}
                    />
                )}
                isHorizontal
                style={{ minWidth: 200, minHeight: 200 }}
            />
        </View>
    );
};

const UnevenRowsFocusTest = () => {
    const renderLists = () =>
        UNEVEN_ROWS_ITEM_COUNTS.map((rowItemCount, rowIndex) => (
            <List key={`${rowItemCount}_${rowIndex}`} rowItemCount={rowItemCount} rowIndex={rowIndex} />
        ));

    return (
        <Screen style={[themeStyles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={themeStyles.textH2}>Focus Test 3 (Uneven rows)</Text>
            <ScrollView style={{ width: '100%' }}>{renderLists()}</ScrollView>
        </Screen>
    );
};

export default UnevenRowsFocusTest;

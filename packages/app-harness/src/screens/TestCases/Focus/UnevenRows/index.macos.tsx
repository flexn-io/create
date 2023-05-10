import React from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { themeStyles } from '../../../../config';
import { UNEVEN_ROWS_ITEM_COUNTS } from './config';

const UnevenRowsFocusTest = () => (
    <View style={[themeStyles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={themeStyles.textH2}>Focus Test 3 (Uneven rows)</Text>
        <ScrollView style={{ width: '100%' }}>
            {UNEVEN_ROWS_ITEM_COUNTS.map((rowItemCount, idx) => (
                <View key={rowItemCount + idx}>
                    <Text
                        style={themeStyles.textH3}
                        testID={`flexn-screens-focus-uneven-row-${idx}-item-count-${rowItemCount}`}
                    >
                        {idx + 1} row ({rowItemCount} items)
                    </Text>
                    <FlatList
                        horizontal
                        data={[...Array(rowItemCount).keys()]}
                        style={{ marginHorizontal: 15, marginVertical: 50 }}
                        renderItem={({ index }) => (
                            <TouchableOpacity
                                style={{ width: 200, height: 200, backgroundColor: 'green', marginHorizontal: 25 }}
                                testID={`flexn-screens-focus-uneven-rows-flat-list-row-${idx}-item-${index}`}
                            />
                        )}
                    />
                </View>
            ))}
        </ScrollView>
    </View>
);

export default UnevenRowsFocusTest;

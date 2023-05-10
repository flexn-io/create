import { TouchableOpacity, ScrollView, Text, View } from '@flexn/create';
import React from 'react';
import { FlatList } from 'react-native';
import { themeStyles } from '../../../../config';
import { DRAWER_BUTTONS_COUNT, ROWS_COUNT, ROW_ITEMS_COUNT } from './config';

const AbsoluteSideDrawerFocusTest = () => (
    <View style={[themeStyles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={themeStyles.textH2}>Focus Test 2 (Absolute Side Drawer)</Text>
        <View
            style={{
                width: '25%',
                backgroundColor: 'red',
                opacity: 0.5,
                justifyContent: 'center',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 2,
            }}
        >
            {[...Array(DRAWER_BUTTONS_COUNT).keys()].map((key, idx) => (
                <TouchableOpacity
                    key={key}
                    style={[themeStyles.button, { minWidth: 150, maxWidth: 250 }]}
                    hasTVPreferredFocus={idx === 0}
                    testID={`flexn-screens-focus-side-drawer-button-${idx}`}
                />
            ))}
        </View>
        <ScrollView style={{ width: '100%' }}>
            {[...Array(ROWS_COUNT).keys()].map((key, idx) => (
                <View key={key}>
                    <Text style={themeStyles.textH3}>Row title</Text>
                    <FlatList
                        horizontal
                        data={[...Array(ROW_ITEMS_COUNT).keys()]}
                        style={{ marginHorizontal: 15, marginVertical: 50 }}
                        renderItem={({ index }) => (
                            <TouchableOpacity
                                style={{
                                    width: 200,
                                    height: 200,
                                    backgroundColor: 'green',
                                    marginHorizontal: 25,
                                }}
                                testID={`flexn-screens-focus-side-drawer-row-${idx}-item-${index}`}
                            />
                        )}
                    />
                </View>
            ))}
        </ScrollView>
    </View>
);

export default AbsoluteSideDrawerFocusTest;

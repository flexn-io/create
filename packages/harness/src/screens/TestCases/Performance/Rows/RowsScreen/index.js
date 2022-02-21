import { Image, TouchableOpacity, ScrollView, Text, VerticalRecyclableList, View } from '@flexn/sdk';
import React from 'react';
import { themeStyles } from '../../../../../config';
import { CARD_TYPES, generateData, Ratio, testProps, useParams } from '../../../../../utils';

const ITEM_HEIGHT = Ratio(240);
const ITEM_WIDTH = Ratio(ITEM_HEIGHT * 1.6);

const RowsScreen = (props) => {
    const { amount } = useParams(props);

    const data = generateData(CARD_TYPES.DEFAULT, 24, amount);

    return (
        <View style={[themeStyles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={[themeStyles.textH2]}>{`${amount} rows`}</Text>
            <ScrollView style={{ width: '100%' }}>
                <VerticalRecyclableList
                    data={data}
                    renderRow={(repeatContext) => (
                        <TouchableOpacity
                            repeatContext={repeatContext}
                            style={{
                                width: ITEM_WIDTH,
                                height: ITEM_HEIGHT,
                                marginHorizontal: 25,
                            }}
                            {...testProps(
                                // eslint-disable-next-line max-len
                                `flexn-screens-focus-performance-row-${repeatContext.index}-screen-image-${repeatContext.index}`
                            )}
                        >
                            <Image
                                source={{ uri: repeatContext.data.image }}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </TouchableOpacity>
                    )}
                />
                {/* {data?.map((row, idx) => (
                    <View key={`${row.title}-${Math.random()}`}>
                        <Text
                            style={themeStyles.textH3}
                            {...testProps(`flexn-screens-focus-performance-rows-screen-row-${idx}-title`)}
                        >
                            {row.title}
                        </Text>
                        <FlatList
                            horizontal
                            data={row.items}
                            style={{ marginHorizontal: 15, marginVertical: 50 }}
                            keyExtractor={(item) => item.key}
                            renderItem={(item) => (
                                <TouchableOpacity
                                    style={{
                                        width: ITEM_WIDTH,
                                        height: ITEM_HEIGHT,

                                        marginHorizontal: 25,
                                    }}
                                    {...testProps(
                                        `flexn-screens-focus-performance-row-${idx}-screen-image-${item.index}`
                                    )}
                                >
                                    <Image
                                        source={{ uri: item.item.image }}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                </TouchableOpacity>
                            )}
                            {...testProps(`flexn-screens-focus-performance-rows-screen-flat-list-row-${idx}`)}
                        />
                    </View>
                ))} */}
            </ScrollView>
        </View>
    );
};

export default RowsScreen;

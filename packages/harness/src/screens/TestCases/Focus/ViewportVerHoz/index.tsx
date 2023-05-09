import { TouchableOpacity, Text, ScrollView } from '@flexn/create';
import React from 'react';
import Screen from '../../../../components/Screen';
import { themeStyles } from '../../../../config';
import { testProps, Ratio } from '../../../../utils';

const rows = new Array(10).fill(0);
const rowsInner = new Array(20).fill(0);

const ViewportSideEdgeVertical = () => (
    <Screen
        style={[themeStyles.screen, { justifyContent: 'center', alignItems: 'center' }]}
        focusOptions={{ horizontalWindowAlignment: 'low-edge', verticalWindowAlignment: 'low-edge' }}
    >
        <Text style={themeStyles.textH2}>Focus Test 1 (Viewport Side Edge)</Text>
        <ScrollView>
            {rows.map((row) => (
                <ScrollView horizontal style={{ marginVertical: Ratio(80) }} key={row}>
                    {rowsInner.map((rowInner, i) => (
                        <TouchableOpacity
                            key={rowInner}
                            style={{
                                width: 150,
                                height: Ratio(300),
                                backgroundColor: 'teal',
                                marginHorizontal: Ratio(15),
                            }}
                            focusOptions={{
                                animatorOptions: {
                                    type: 'border',
                                    colorFocus: '#ff0000',
                                    borderWidth: Ratio(3),
                                },
                                forbiddenFocusDirections: i === rowsInner.length - 1 ? ['right'] : []
                            }}
                            {...testProps('flexn-screens-focus-misaligned-buttons-btn-1')}
                        />
                    ))}
                </ScrollView>
            ))}
        </ScrollView>
    </Screen>
);

export default ViewportSideEdgeVertical;

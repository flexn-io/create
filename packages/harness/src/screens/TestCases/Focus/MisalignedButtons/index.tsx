import { TouchableOpacity, Text, View } from '@flexn/create';
import React from 'react';
import Screen from '../../../../components/Screen';
import { themeStyles } from '../../../../config';
import { testProps } from '../../../../utils';

const ScreenHome = () => (
    <Screen style={[themeStyles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={themeStyles.textH2}>Focus Test 1 (Misaligned buttons)</Text>
        <View
            style={{
                width: '85%',
                justifyContent: 'space-between',
                flexDirection: 'row',
            }}
        >
            <TouchableOpacity
                style={{ width: 180, height: 100, backgroundColor: 'teal' }}
                {...testProps('flexn-screens-focus-misaligned-buttons-btn-1')}
            />
            <TouchableOpacity
                style={{ width: 180, height: 100, backgroundColor: 'teal' }}
                {...testProps('flexn-screens-focus-misaligned-buttons-btn-2')}
            />
        </View>
        <View style={{ width: '75%', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
                style={{ width: 180, height: 100, backgroundColor: 'teal' }}
                {...testProps('flexn-screens-focus-misaligned-buttons-btn-3')}
            />
        </View>
    </Screen>
);

export default ScreenHome;

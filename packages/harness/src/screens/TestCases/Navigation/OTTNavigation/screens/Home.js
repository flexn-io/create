import { TouchableOpacity, Text } from '@flexn/sdk';
import React from 'react';
import Screen from '../../../../../components/Screen';
import Theme from '../../../../../config';
import { testProps } from '../../../../../utils';

const HomeScreen = ({ navigation }) => (
    <Screen
        style={{
            flex: 1,
            marginTop: 100,
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <Text style={{ color: Theme.color4 }}>This is Home (rows) screen</Text>
        <TouchableOpacity
            style={{ padding: 25, borderColor: Theme.color2, borderWidth: 2 }}
            onPress={() => navigation.navigate('details')}
            {...testProps('flexn-screens-ott-navigation-navigate-to-details')}
        >
            <Text style={{ color: Theme.color4 }}>Asset</Text>
        </TouchableOpacity>
    </Screen>
);

export default HomeScreen;

import { TouchableOpacity, Text } from '@flexn/sdk';
import React from 'react';
import Screen from '../../../../../components/Screen';
import Theme from '../../../../../config';
import { testProps } from '../../../../../utils';

const MoreScreen = ({ navigation }) => (
    <Screen
        style={{
            flex: 1,
            marginTop: 100,
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <Text style={{ color: Theme.color4 }}>This is More screen</Text>
        <TouchableOpacity
            style={{ padding: 25, borderColor: Theme.color2, borderWidth: 2 }}
            onPress={() => navigation.navigate('home')}
            {...testProps('flexn-screens-ott-navigation-navigate-to-home')}
        >
            <Text style={{ color: Theme.color4 }}>Rows Screen</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={{
                padding: 25,
                borderColor: Theme.color2,
                borderWidth: 2,
                marginTop: 5,
            }}
            onPress={() => navigation.navigate('auth', { screen: 'signin' })}
            {...testProps('flexn-screens-ott-navigation-navigate-to-sign-in')}
        >
            <Text style={{ color: Theme.color4 }}>Sign In</Text>
        </TouchableOpacity>
    </Screen>
);

export default MoreScreen;

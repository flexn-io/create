import { TouchableOpacity, Text } from '@flexn/sdk';
import React from 'react';
import Screen from '../../../../../components/Screen';
import Theme from '../../../../../config';
import { testProps } from '../../../../../utils';

const LogInScreen = ({ navigation }) => (
    <Screen
        style={{
            flex: 1,
            marginTop: 100,
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <Text style={{ color: Theme.color4 }}>This is LogIn screen</Text>
        <TouchableOpacity
            style={{ padding: 25, borderColor: Theme.color2, borderWidth: 2 }}
            onPress={() => navigation.replace('app')}
            {...testProps('flexn-screens-ott-navigation-login-button')}
        >
            <Text style={{ color: Theme.color4 }}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={{ padding: 25, borderColor: Theme.color2, borderWidth: 2 }}
            onPress={() => navigation.navigate('signup')}
            {...testProps('flexn-screens-ott-navigation-register-button')}
        >
            <Text style={{ color: Theme.color4 }}>Register</Text>
        </TouchableOpacity>
    </Screen>
);

export default LogInScreen;

import { Text } from '@flexn/create';
import React from 'react';
import Screen from '../../../../../components/Screen';
import Theme from '../../../../../config';

const DetailsScreen = () => (
    <Screen
        style={{
            flex: 1,
            marginTop: 100,
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <Text style={{ color: Theme.color4 }}>This is Details screen</Text>
    </Screen>
);

export default DetailsScreen;

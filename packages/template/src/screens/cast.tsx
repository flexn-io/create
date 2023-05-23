import React from 'react';
import { Text } from '@flexn/create';
import { themeStyles } from '../config';
import Screen from './screen';

const ScreenCast = () => (
    <Screen style={themeStyles.screen}>
        <Text style={themeStyles.textH2}>This is cast Page!</Text>
    </Screen>
);

export default ScreenCast;

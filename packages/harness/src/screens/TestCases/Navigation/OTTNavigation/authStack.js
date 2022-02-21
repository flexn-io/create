import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';

const RootStack = createStackNavigator();

const AuthStack = () => (
    <RootStack.Navigator headerMode="none">
        <RootStack.Screen name="signin" component={LoginScreen} />
        <RootStack.Screen name="signup" component={RegisterScreen} />
    </RootStack.Navigator>
);

export default AuthStack;

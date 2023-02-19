import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Selector from '../screens/selector';
import Row from '../screens/row';
import DynamicState from '../screens/dynamicState';
import DirectionalFocus from '../screens/directionalFocus';
import Animations from '../screens/animations';
import List from '../screens/list';

const RootStack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="List">
                <RootStack.Screen name="Selector" component={Selector} />
                <RootStack.Screen name="Row" component={Row} />
                <RootStack.Screen name="DynamicState" component={DynamicState} />
                <RootStack.Screen name="DirectionalFocus" component={DirectionalFocus} />
                <RootStack.Screen name="Animations" component={Animations} />
                <RootStack.Screen name="List" component={List} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;

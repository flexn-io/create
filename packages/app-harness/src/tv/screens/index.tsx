import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Selector from './selector';
import Row from './row';
import DynamicState from './dynamicState';
import DynamicState2 from './dynamicState2';
import DirectionalFocus from './directionalFocus';
import Animations from './animations';
import List from './list';
import Overflow from './overflow';

const RootStack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Overflow">
                <RootStack.Screen name="Selector" component={Selector} />
                <RootStack.Screen name="Row" component={Row} />
                <RootStack.Screen name="DynamicState" component={DynamicState} />
                <RootStack.Screen name="DynamicState2" component={DynamicState2} />
                <RootStack.Screen name="DirectionalFocus" component={DirectionalFocus} />
                <RootStack.Screen name="Animations" component={Animations} />
                <RootStack.Screen name="List" component={List} />
                <RootStack.Screen name="Overflow" component={Overflow} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;

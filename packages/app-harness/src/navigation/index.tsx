import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '../libs/@react-navigation';
import Selector from '../screens/selector';
import testsList from '../testsList';

const RootStack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Selector">
                <RootStack.Screen name="Selector" component={Selector} />
                {testsList.map((test) => (
                    <RootStack.Screen key={test.route} name={test.route} component={test.component} />
                ))}
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '../libs/@react-navigation';
import Selector from '../screens/selector';
import testsList, { Test } from '../testsList';

const RootStack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Selector">
                <RootStack.Screen name="Selector" component={Selector} />
                {testsList().map((test: Test) => (
                    <RootStack.Screen
                        key={test.route}
                        name={test.route}
                        component={test.component}
                        initialParams={{ id: test.id, description: test.description }}
                    />
                ))}
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;

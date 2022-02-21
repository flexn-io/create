import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import DetailsScreen from './screens/Details';
import HomeScreen from './screens/Home';

const Stack = createStackNavigator();

const HomeStackNavigator = () => (
    <Stack.Navigator mode="modal">
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="details" component={DetailsScreen} />
    </Stack.Navigator>
);

export default HomeStackNavigator;

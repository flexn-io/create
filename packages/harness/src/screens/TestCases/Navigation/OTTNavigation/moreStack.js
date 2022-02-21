import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import DetailsScreen from './screens/Details';
import HomeScreen from './screens/Home';
import MoreScreen from './screens/More';

const Stack = createStackNavigator();

const MoreStackNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name="more" component={MoreScreen} />
        <Stack.Screen
            name="moreRowPage"
            component={HomeScreen}
            options={{
                headerShown: true,
                title: 'Additional Rows Screen (PageStack)',
            }}
        />
        <Stack.Screen name="details" component={DetailsScreen} />
    </Stack.Navigator>
);

export default MoreStackNavigator;

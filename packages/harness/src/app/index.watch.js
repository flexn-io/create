import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ScreenHome from '../screens/Home';
import FocusTestScreens from '../screens/TestCases/Focus';
import NavigationTestScreens from '../screens/TestCases/Navigation';
import PerformanceTestScreens, { PerformanceTestNestedScreens } from '../screens/TestCases/Performance';

const RootStack = createStackNavigator();

const App = () => (
    <NavigationContainer>
        <RootStack.Navigator headerMode="none" mode="modal">
            <RootStack.Screen name="home" component={ScreenHome} />
            {/* Watches will most likely have different test cases, but for now adding all anyway */}
            {Object.entries({
                ...FocusTestScreens,
                ...NavigationTestScreens,
                ...PerformanceTestScreens,
                ...PerformanceTestNestedScreens,
            }).map(([screenName, screen]) => (
                <RootStack.Screen key={screenName} name={screenName} component={screen} />
            ))}
        </RootStack.Navigator>
    </NavigationContainer>
);

export default App;

import { App, Debugger } from '@flexn/sdk';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import * as Sentry from '@sentry/react-native';
import React from 'react';
import { isFactorDesktop, isFactorTv } from '@rnv/renative';
import Theme from '../config';
import ScreenHome from '../screens/Home';
import CastTestScreens from '../screens/TestCases/Cast';
import FocusTestScreens from '../screens/TestCases/Focus';
import ComponentsTestScreens from '../screens/TestCases/Components';
import NavigationTestScreens from '../screens/TestCases/Navigation';
import PerformanceTestScreens, { PerformanceTestNestedScreens } from '../screens/TestCases/Performance';
import PlayerTestScreens from '../screens/TestCases/Player';
import { useCastChannel } from '../utils/libs/react-native-google-cast';

const RootStack = isFactorTv ? createNativeStackNavigator() : createStackNavigator();

const Entry = () => {
    const channel = useCastChannel('urn:x-cast:com.flexn.app.harness');

    return (
        <App style={{ flex: 1 }}>
            <NavigationContainer
                theme={{
                    ...DarkTheme,
                    colors: {
                        ...DarkTheme.colors,
                        background: Theme.color1,
                        text: Theme.color2,
                    },
                }}
                onStateChange={(state) => {
                    const route = state.routes[state.index];
                    channel?.sendMessage({
                        navigateTo: route.name === 'root' ? '/' : `/${route.name}`,
                        state: route.params?.state,
                    });
                }}
            >
                {/* initialRouteName="*" */}
                <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="List">  
                    <RootStack.Screen name="root" component={ScreenHome} />
                    {Object.entries({
                        ...(!isFactorDesktop ? FocusTestScreens : {}), // don't add focus test screens to navigation for macos/windows platforms (react-native-gesture-handler is not supported yet)
                        ...PerformanceTestScreens,
                        ...PerformanceTestNestedScreens,
                        ...CastTestScreens,
                        ...PlayerTestScreens,
                        ...NavigationTestScreens,
                        ...ComponentsTestScreens,
                    }).map(([screenName, screen]) => (
                        <RootStack.Screen
                            key={screenName}
                            name={screenName}
                            component={screen}
                            options={{ headerShown: isFactorDesktop }}
                        />
                    ))}
                </RootStack.Navigator>
            </NavigationContainer>
            <Debugger />
        </App>
    );
};

export default Sentry.wrap(Entry);

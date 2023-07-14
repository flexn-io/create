import React, { useContext, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { View } from '@flexn/create';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ScreenHome from '../screens/home';
import ScreenCarousels from '../screens/carousels';
import ScreenDetails from '../screens/details';
import ScreenModal from '../screens/modal';
import Menu from '../components/menu';
import { ThemeContext, ROUTES } from '../config';

const Stack = createStackNavigator();
const RootStack = createStackNavigator();

const StackNavigator = ({ navigation }: any) => {
    const { theme, dark } = useContext(ThemeContext);

    return (
        <View style={{ flexDirection: 'row', flex: 1 }}>
            <Menu navigation={navigation} />
            <Stack.Navigator
                screenOptions={{
                    headerTitleStyle: theme.styles.headerTitle,
                    headerStyle: theme.styles.header,
                    cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
                    headerShadowVisible: dark ? false : true,
                }}
            >
                <Stack.Screen name={ROUTES.HOME} component={ScreenHome} />
                <Stack.Screen name={ROUTES.CAROUSELS} component={ScreenCarousels} />
                <Stack.Screen name={ROUTES.DETAILS} component={ScreenDetails} />
            </Stack.Navigator>
        </View>
    );
};

const App = () => {
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        StatusBar.setBarStyle(theme.static.statusBar);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <NavigationContainer>
                <RootStack.Navigator
                    screenOptions={{
                        presentation: 'modal',
                        headerShown: false,
                        cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
                    }}
                >
                    <RootStack.Screen name="stack" component={StackNavigator} />
                    <RootStack.Screen name={ROUTES.MODAL} component={ScreenModal} />
                </RootStack.Navigator>
            </NavigationContainer>
        </View>
    );
};

export default App;

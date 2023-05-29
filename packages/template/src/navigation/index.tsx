import React, { useContext, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
// import { CastButton } from 'react-native-google-cast';
import ScreenHome from '../screens/home';
import ScreenCarousels from '../screens/carousels';
import ScreenDetails from '../screens/details';
import ScreenModal from '../screens/modal';
import Menu, { DrawerButton } from '../components/menu';
import { ROUTES, ThemeContext } from '../config';

const ModalStack = createStackNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CarouselsStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen name={ROUTES.CAROUSELS} component={ScreenCarousels} />
        <Stack.Screen name={ROUTES.DETAILS} component={ScreenDetails} />
    </Stack.Navigator>
);

const DrawerNavigator = ({ navigation }: any) => {
    const { theme } = useContext(ThemeContext);

    return (
        <Drawer.Navigator
            drawerContent={(props) => <Menu {...props} />}
            screenOptions={{
                headerLeft: () => <DrawerButton navigation={navigation} />,
                headerTitleStyle: theme.styles.headerTitle,
                headerStyle: theme.styles.header,
                headerShown: true,
            }}
        >
            <Drawer.Screen
                name={ROUTES.HOME}
                component={ScreenHome}
                // options={{
                //     headerRight: () => (
                //         <CastButton
                //             style={{
                //                 width: theme.static.iconSize,
                //                 height: theme.static.iconSize,
                //                 tintColor: theme.static.colorBrand,
                //             }}
                //         />
                //     ),
                // }}
            />
            <Drawer.Screen name={ROUTES.CAROUSELS} component={CarouselsStack} />
        </Drawer.Navigator>
    );
};

const App = () => {
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        StatusBar.setBarStyle(theme.static.statusBar);
        StatusBar.setBackgroundColor(theme.static.colorBgPrimary);
    }, [theme?.static]);

    return (
        <NavigationContainer>
            <ModalStack.Navigator
                screenOptions={{
                    presentation: 'modal',
                    headerShown: false,
                    cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
                }}
            >
                <ModalStack.Screen name="drawer" component={DrawerNavigator} />
                <ModalStack.Screen name={ROUTES.MODAL} component={ScreenModal} />
            </ModalStack.Navigator>
        </NavigationContainer>
    );
};

export default App;

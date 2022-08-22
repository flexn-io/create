import React, { useContext } from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ScreenHome from '../screens/home';
import ScreenCarousels from '../screens/carousels';
import ScreenDetails from '../screens/details';
import ScreenModal from '../screens/modal';
import { ROUTES, ThemeContext } from '../config';

const ModalStack = createStackNavigator();
const Stack = createStackNavigator();

const CarouselsStack = () => (
    <Stack.Navigator>
        <Stack.Screen name={ROUTES.CAROUSELS} component={ScreenCarousels} />
        <Stack.Screen name={ROUTES.DETAILS} component={ScreenDetails} />
    </Stack.Navigator>
);

const App = () => {
    // eslint-disable-next-line
    const { theme } = useContext(ThemeContext);

    return (
        <NavigationContainer>
            <ModalStack.Navigator
                // headerMode="none"
                initialRouteName="carousels"
                // mode="modal"
                screenOptions={{
                    cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
                }}
            >
                <ModalStack.Screen name={'home'} component={ScreenHome} />
                <ModalStack.Screen name={ROUTES.MODAL} component={ScreenModal} />
                <ModalStack.Screen name={ROUTES.CAROUSELS} component={CarouselsStack} />
            </ModalStack.Navigator>
        </NavigationContainer>
    );
};

export default App;

import React, { useContext } from 'react';
import { StatusBar } from 'react-native';
import { View } from '@flexn/sdk';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ScreenHome from '../screens/screenHome';
import ScreenCarousels from '../screens/screenCarousels';
import ScreenDetails from '../screens/screenDetails';
import ScreenModal from '../screens/screenModal';
import Menu from '../components/menu';
import { ThemeContext, ROUTES } from '../config';

const Stack = createStackNavigator();
const RootStack = createStackNavigator();

const StackNavigator = ({ navigation }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <View style={{ flexDirection: 'row', flex: 1 }}>
            <Menu navigation={navigation} />
            <Stack.Navigator
                screenOptions={{
                    headerTitleStyle: theme.styles.headerTitle,
                    headerStyle: theme.styles.header,
                    cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
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
    React.useEffect(() => {
        StatusBar.setBarStyle(theme.static.statusBar);
    }, []);
    return (
        <View style={{ marginTop: 36, flex: 1 }}>
            <NavigationContainer>
                <RootStack.Navigator
                    headerMode="none"
                    mode="modal"
                    screenOptions={{
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

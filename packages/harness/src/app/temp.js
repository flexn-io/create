import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
// import { CastButton } from 'react-native-google-cast';
import { getScaledValue } from '@rnv/renative';
import Menu, { DrawerButton } from '../components/menu';
import ScreenModal from '../components/screenModal';
import Theme from '../config';
import ScreenHome from '../screens/Home';

const Stack = createStackNavigator();
const ModalStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
    headerTitle: {
        color: Theme.color3,
        fontFamily: Theme.primaryFontFamily,
        fontSize: getScaledValue(18),
    },
    header: {
        backgroundColor: Theme.color1,
        borderBottomWidth: 1,
        height: getScaledValue(70),
    },
});

const StackNavigator = ({ navigation }) => (
    <Stack.Navigator
        screenOptions={{
            headerTitleStyle: styles.headerTitle,
            headerStyle: styles.header,
            headerTintColor: Theme.color3,
        }}
    >
        <Stack.Screen
            name="home"
            component={ScreenHome}
            options={{
                headerLeft: () => <DrawerButton navigation={navigation} />,
                // headerRight: () => (
                //     <CastButton style={{ width: Theme.iconSize, height: Theme.iconSize, tintColor: Theme.color3 }} />
                // ),
            }}
        />
    </Stack.Navigator>
);

const ModalNavigator = () => (
    <ModalStack.Navigator headerMode="none" mode="modal">
        <ModalStack.Screen name="stack" component={StackNavigator} />
        <ModalStack.Screen name="modal" component={ScreenModal} />
    </ModalStack.Navigator>
);

const App = () => {
    React.useEffect(() => {
        StatusBar.setBarStyle(Theme.statusBar);
    }, []);
    return (
        <NavigationContainer>
            <Drawer.Navigator drawerContent={Menu}>
                <Drawer.Screen name="drawer" component={ModalNavigator} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

export default App;

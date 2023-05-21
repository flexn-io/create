import React, { useEffect } from 'react';
import { View } from '@flexn/create';
import { TVMenuControl, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigationBuilder, TabRouter, createNavigatorFactory } from '@react-navigation/native';
import { isPlatformTvos } from '@rnv/renative';
import ScreenHome from '../screens/home';
import ScreenCarousels from '../screens/carousels';
import ScreenDetails from '../screens/details';
import ScreenModal from '../screens/modal';
import Menu from '../components/menu';
import { ROUTES } from '../config';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const createTVSideNavigator = createNavigatorFactory(Navigator);

function Navigator({ initialRouteName, children, screenOptions, drawerContent, ...rest }) {
    const { state, navigation, descriptors, NavigationContent } = useNavigationBuilder(TabRouter, {
        children,
        screenOptions,
        initialRouteName,
    });

    useEffect(() => {
        if (isPlatformTvos) {
            TVMenuControl.enableTVMenuKey();
            if (state.index === 0) {
                TVMenuControl.disableTVMenuKey();
            }
        }
    }, [navigation, state.index]);

    return (
        <NavigationContent>
            <View style={styles.container}>
                {drawerContent({
                    state,
                    navigation,
                    descriptors,
                    ...rest,
                })}
            </View>

            <View style={styles.main}>
                {state.routes.map((route, i) => {
                    return (
                        <View
                            key={route.key}
                            style={[StyleSheet.absoluteFill, { display: i === state.index ? 'flex' : 'none' }]}
                        >
                            {descriptors[route.key].render()}
                        </View>
                    );
                })}
            </View>
        </NavigationContent>
    );
}

const RootStack = createNativeStackNavigator();
const SideNavigatorStack = createTVSideNavigator();

const SideNavigator = () => (
    <SideNavigatorStack.Navigator
        drawerContent={({ navigation }: { navigation: any }) => <Menu navigation={navigation} />}
    >
        <SideNavigatorStack.Screen name={ROUTES.HOME} component={ScreenHome} />
        <SideNavigatorStack.Screen name={ROUTES.CAROUSELS} component={ScreenCarousels} />
        <SideNavigatorStack.Screen name={ROUTES.DETAILS} component={ScreenDetails} />
    </SideNavigatorStack.Navigator>
);

const App = () => (
    <SafeAreaProvider>
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                <RootStack.Screen name="stack" component={SideNavigator} />
                <RootStack.Screen name={ROUTES.MODAL} component={ScreenModal} />
            </RootStack.Navigator>
        </NavigationContainer>
    </SafeAreaProvider>
);

const styles = StyleSheet.create({
    container: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        opacity: 1,
        position: 'absolute',
    },
    content: { flex: 1 },
    main: { flex: 1 },
});

export default App;

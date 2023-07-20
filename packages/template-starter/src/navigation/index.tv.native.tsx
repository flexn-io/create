import React, { useEffect } from 'react';
import { disableTVMenuKey, enableTVMenuKey, setFocusManagerEnabled, View } from '@flexn/create';
import { isPlatformTizen, isPlatformWebos } from '@rnv/renative';
import { enableScreens } from 'react-native-screens';
import { StyleSheet, Dimensions } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    NavigationContainer,
    useNavigationBuilder,
    createNavigatorFactory,
    StackRouter,
} from '@react-navigation/native';
import { ScreenContainer, Screen } from 'react-native-screens';
import ScreenHome from '../screens/home';
import ScreenCarousels from '../screens/carousels';
import ScreenDetails from '../screens/details';
import ScreenModal from '../screens/modal';
import Menu from '../components/menu';
import { ROUTES } from '../config';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

setFocusManagerEnabled(true);
enableScreens();

const createTVSideNavigator = createNavigatorFactory(Navigator);

function Navigator({ initialRouteName, children, screenOptions, drawerContent, ...rest }: any) {
    const { state, navigation, descriptors, NavigationContent } = useNavigationBuilder(StackRouter, {
        children,
        screenOptions,
        initialRouteName,
    });

    useEffect(() => {
        enableTVMenuKey();
        if (state.index === 0) {
            disableTVMenuKey();
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

            <ScreenContainer style={styles.main}>
                {state.routes.map((route, i) => {
                    const isFocused = state.index === i;
                    const style =
                        isPlatformTizen || isPlatformWebos
                            ? { opacity: isFocused ? 1 : 0 }
                            : [StyleSheet.absoluteFill, { opacity: isFocused ? 1 : 0 }];

                    return (
                        <Screen key={route.key} style={style} active={isFocused ? 1 : 0}>
                            {descriptors[route.key].render()}
                        </Screen>
                    );
                })}
            </ScreenContainer>
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
        ...((isPlatformTizen || isPlatformWebos) && { height }),
    },
    content: { flex: 1 },
    main: { flex: 1 },
});

export default App;

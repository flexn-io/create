import React, { useEffect, useCallback } from 'react';
import { View } from '@flexn/sdk';
import { TVMenuControl, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    NavigationContainer,
    useNavigationBuilder,
    StackActions,
    StackRouter,
    createNavigatorFactory,
} from '@react-navigation/native';
import { screensEnabled } from 'react-native-screens';
import { isPlatformTvos } from 'renative';
import { ScreenContainer } from 'react-native-screens'; //eslint-disable-line
import ResourceSavingScene from '@react-navigation/drawer/src/views/ResourceSavingScene';

import ScreenHome from '../screens/home';
import ScreenCarousels from '../screens/carousels';
import ScreenDetails from '../screens/details';
import ScreenModal from '../screens/modal';
import Menu from '../components/menu';
import { ROUTES } from '../config';

const createTVSideNavigator = createNavigatorFactory(Navigator);

function Navigator({ initialRouteName, children, screenOptions, drawerContent, ...rest }) {
    if (!screensEnabled()) {
        throw new Error('Native stack is only available if React Native Screens is enabled.');
    }

    const { state, navigation, descriptors } = useNavigationBuilder(StackRouter, {
        initialRouteName,
        children,
        screenOptions,
    });

    const tabPressEventHandler = useCallback(() => {
        const isFocused = navigation.isFocused();
        requestAnimationFrame(() => {
            if (state.index > 0 && isFocused) {
                navigation.dispatch({
                    ...StackActions.popToTop(),
                    target: state.key,
                });
            }
        });
    }, [navigation, state.index, state.key]);

    useEffect(() => {
        if (isPlatformTvos) {
            TVMenuControl.enableTVMenuKey();
            if (state.index === 0) {
                TVMenuControl.disableTVMenuKey();
            }
        }

        navigation.addListener('tabPress', tabPressEventHandler);
        return () => navigation.removeListener('tabPress', tabPressEventHandler);
    }, [navigation, state.index, tabPressEventHandler]);

    const renderContent = () => (
        <ScreenContainer style={styles.content}>
            {state.routes.map((route, index) => {
                const descriptor = descriptors[route.key];
                const { unmountOnBlur } = descriptor.options;
                const isFocused = state.index === index;

                if (unmountOnBlur && !isFocused) {
                    return null;
                }

                return (
                    <ResourceSavingScene
                        key={route.key}
                        style={[StyleSheet.absoluteFill, { opacity: isFocused ? 1 : 0 }]}
                        isVisible={isFocused}
                        enabled
                    >
                        {descriptor.render()}
                    </ResourceSavingScene>
                );
            })}
        </ScreenContainer>
    );

    const renderDrawerView = () =>
        drawerContent({
            state,
            navigation,
            descriptors,
            ...rest,
        });

    return (
        <View style={styles.main}>
            <View style={[styles.container]}>{renderDrawerView()}</View>
            <View style={[styles.content]}>{renderContent()}</View>
        </View>
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
    <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="stack" component={SideNavigator} />
            <RootStack.Screen name={ROUTES.MODAL} component={ScreenModal} />
        </RootStack.Navigator>
    </NavigationContainer>
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

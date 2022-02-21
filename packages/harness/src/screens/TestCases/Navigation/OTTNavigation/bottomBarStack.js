import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';
import { getScaledValue, Icon } from 'renative';
import Theme from '../../../../config';
import HomeStackNavigator from './homeStack';
import MoreStackNavigator from './moreStack';

const styles = StyleSheet.create({
    headerTitle: {
        color: Theme.accent,
        fontSize: getScaledValue(18),
    },
    header: {
        backgroundColor: Theme.background,
        borderBottomWidth: 1,
        height: getScaledValue(70),
    },
    castButton: { width: Theme.iconSize, height: Theme.iconSize, tintColor: Theme.accent },
    bottomBar: {
        backgroundColor: Theme.background,
        color: Theme.background,
        borderTopColor: Theme.border,
        borderTopWidth: 0.3,
    },
});

const BottomTabNavigator = createBottomTabNavigator();

const BottomTabsNavigator = () => (
    <BottomTabNavigator.Navigator
        barStyle={styles.bottomBar}
        activeColor={Theme.primary}
        inactiveColor={Theme.textSecondary}
    >
        <BottomTabNavigator.Screen
            name="home"
            component={HomeStackNavigator}
            options={{
                title: 'Home (BottomTabNavigator)',
                tabBarIcon: () => <Icon iconName="home" iconFont="materialIcons" size={24} iconColor={Theme.color2} />,
            }}
        />
        <BottomTabNavigator.Screen
            name="more"
            component={MoreStackNavigator}
            options={{
                title: 'More (BottomTabNavigator)',
                tabBarIcon: () => <Icon iconName="menu" iconFont="materialIcons" size={24} iconColor={Theme.color2} />,
            }}
        />
    </BottomTabNavigator.Navigator>
);

export default BottomTabsNavigator;

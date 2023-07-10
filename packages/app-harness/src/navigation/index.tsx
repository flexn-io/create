import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '../libs/@react-navigation';
import Selector from '../screens/selector';
import Row from '../screens/row';
import DynamicState from '../screens/dynamicState';
import DynamicState2 from '../screens/dynamicState2';
import DirectionalFocus from '../screens/directionalFocus';
import Animations from '../screens/animations';
import List from '../screens/list';
import VerticalScroll from '../screens/verticalScroll';
import HorizontalScroll from '../screens/horizontalScroll';
import NestedScroll from '../screens/nestedScroll';
import Overflow from '../screens/overflow';
import PressableAnimations from '../screens/pressableAnimations';
import ViewGroup from '../screens/viewGroup';
import Grid from '../screens/grid';
import ScrollToTop from '../screens/scrollToTop';
import ComplexTabs from '../screens/complexTabs';
import HideAllElements from '../screens/hideAllElements';
import RemoteHandler from '../screens/remoteHandler';

const RootStack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Selector">
                <RootStack.Screen name="Selector" component={Selector} />
                <RootStack.Screen name="Row" component={Row} />
                <RootStack.Screen name="Grid" component={Grid} />
                <RootStack.Screen name="DynamicState" component={DynamicState} />
                <RootStack.Screen name="DynamicState2" component={DynamicState2} />
                <RootStack.Screen name="DirectionalFocus" component={DirectionalFocus} />
                <RootStack.Screen name="Animations" component={Animations} />
                <RootStack.Screen name="List" component={List} />
                <RootStack.Screen name="VerticalScroll" component={VerticalScroll} />
                <RootStack.Screen name="HorizontalScroll" component={HorizontalScroll} />
                <RootStack.Screen name="NestedScroll" component={NestedScroll} />
                <RootStack.Screen name="Overflow" component={Overflow} />
                <RootStack.Screen name="PressableAnimations" component={PressableAnimations} />
                <RootStack.Screen name="ViewGroup" component={ViewGroup} />
                <RootStack.Screen name="ScrollToTop" component={ScrollToTop} />
                <RootStack.Screen name="ComplexTabs" component={ComplexTabs} />
                <RootStack.Screen name="HideAllElements" component={HideAllElements} />
                <RootStack.Screen name="RemoteHandler" component={RemoteHandler} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;

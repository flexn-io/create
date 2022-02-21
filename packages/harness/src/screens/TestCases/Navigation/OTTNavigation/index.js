import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AuthStack from './authStack';
import MenuStack from './bottomBarStack';

const RootStack = createStackNavigator();

const App = () => (
    <RootStack.Navigator>
        <RootStack.Screen name="auth" component={AuthStack} />
        <RootStack.Screen name="app" component={MenuStack} />
    </RootStack.Navigator>
);

export default App;

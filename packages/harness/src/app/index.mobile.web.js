import { View } from '@flexn/create';
import { navigate, Router } from '@reach/router';
import React, { useEffect } from 'react';
import Menu from '../components/menu';
import ScreenModal from '../components/screenModal';
import { themeStyles } from '../config';
import ScreenHome from '../screens/Home';
import FocusTestScreens from '../screens/TestCases/Focus';
import NavigationTestScreens from '../screens/TestCases/Navigation';
import PerformanceTestScreens, { PerformanceTestNestedScreens } from '../screens/TestCases/Performance';

const App = () => {
    useEffect(() => {
        // Required for tizen
        if (window.focus) window.focus();
    }, []);

    return (
        <View style={themeStyles.app}>
            <Menu focusKey="menu" navigate={navigate} />
            <View style={themeStyles.appContainer}>
                <Router>
                    {Object.entries({
                        ...FocusTestScreens,
                        ...NavigationTestScreens,
                        ...PerformanceTestScreens,
                        ...PerformanceTestNestedScreens,
                    }).map(([screenName, Screen]) => (
                        <Screen key={screenName} path={screenName} />
                    ))}
                    <ScreenHome path="/" />
                    <ScreenModal path="modal" />
                </Router>
            </View>
        </View>
    );
};

export default App;

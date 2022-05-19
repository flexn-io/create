/* eslint-disable no-underscore-dangle */
import { Router, Utils } from '@lightningjs/sdk';
import HomeScreen from '../screens/Home';
import FocusTestScreens from '../screens/TestCases/Focus';
import ComponentsScreens from '../screens/TestCases/Components';
import NavigationTestScreens from '../screens/TestCases/Navigation';
import PerformanceTestScreens, { PerformanceTestNestedScreens } from '../screens/TestCases/Performance';

export default class App extends Router.App {
    static getFonts() {
        return [{ family: 'Inter-Light', url: Utils.asset('fonts/Inter-Light.ttf') }];
    }

    _handleKey(e) {
        switch (e.keyCode) {
            case 27:
            case 10009:
            case 461:
                Router.back();
                break;

            default:
                break;
        }
    }

    _setup() {
        Router.startRouter({
            root: 'home',
            routes: [
                {
                    path: 'home',
                    component: HomeScreen,
                },
                ...Object.entries({
                    ...FocusTestScreens,
                    ...ComponentsScreens,
                    ...NavigationTestScreens,
                    ...PerformanceTestScreens,
                    ...PerformanceTestNestedScreens,
                }).map(([screenName, screen]) => ({
                    path: screenName,
                    component: screen,
                })),
            ],
        });
    }
}

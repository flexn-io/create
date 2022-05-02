/* eslint-disable no-underscore-dangle */
import { Router } from '@lightningjs/sdk';
import { ROUTES } from '../config';

import HomeScreen from '../screens/home';
import DetailScreen from '../screens/details';
import ModalScreen from '../screens/modal';
import CarouselsScreen from '../screens/carousels';
import SideMenu from '../components/menu';

export default class App extends Router.App {
    _setup() {
        Router.startRouter({
            root: ROUTES.HOME,
            afterEachRoute: () => {
                Router.focusPage();
            },
            routes: [
                {
                    path: ROUTES.HOME,
                    component: HomeScreen,
                    widgets: ['SideMenu']
                },
                {
                    path: ROUTES.DETAILS,
                    component: DetailScreen,
                    widgets: ['SideMenu']
                },
                {
                    path: ROUTES.CAROUSELS,
                    component: CarouselsScreen,
                    widgets: ['SideMenu']
                },
                {
                    path: ROUTES.MODAL,
                    component: ModalScreen,
                }
            ],
        });
    }

    static _template() {
        return {
            Pages: {
                forceZIndexContext: true
            },
            Widgets: {
                SideMenu: {
                    type: SideMenu
                }
            }
        };
    }

    _handleLeft() {
        Router.focusWidget('SideMenu');
    }
}

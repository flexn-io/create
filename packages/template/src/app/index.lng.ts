import { Router, Utils } from '@lightningjs/sdk';
import { ROUTES } from '../config';

import HomeScreen from '../screens/home.lng';
import DetailScreen from '../screens/details.lng';
import ModalScreen from '../screens/modal.lng';
import CarouselsScreen from '../screens/carousels.lng';
import SideMenu from '../components/menu';

export default class App extends Router.App {
    static getFonts() {
        return [{ family: 'Inter-Light', url: Utils.asset('fonts/Inter-Light.ttf') }];
    }

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
                    widgets: ['side-menu'],
                },
                {
                    path: ROUTES.DETAILS,
                    component: DetailScreen,
                    widgets: ['side-menu'],
                },
                {
                    path: ROUTES.CAROUSELS,
                    component: CarouselsScreen,
                    widgets: ['side-menu'],
                },
                {
                    path: ROUTES.MODAL,
                    component: ModalScreen,
                },
            ],
        });
    }

    static _template() {
        return {
            Pages: {
                forceZIndexContext: true,
            },
            Widgets: {
                SideMenu: {
                    type: SideMenu,
                },
            },
        };
    }

    _handleLeft() {
        Router.focusWidget('SideMenu');
    }
}

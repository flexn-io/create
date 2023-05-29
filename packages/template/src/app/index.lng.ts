import { Lightning, Router, Utils } from '@lightningjs/sdk';
import { ROUTES } from '../config';

import HomeScreen from '../screens/home.lng';
import DetailScreen from '../screens/details.lng';
import ModalScreen from '../screens/modal.lng';
import CarouselsScreen from '../screens/carousels.lng';
import SideMenu from '../components/menu.lng';

export interface AppTemplateSpec extends Router.App.TemplateSpec {
    Widgets: {
        SideMenu: typeof SideMenu;
    };
}

export default class App
    extends Router.App<AppTemplateSpec>
    implements Lightning.Component.ImplementTemplateSpec<AppTemplateSpec>
{
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
                    widgets: ['sidemenu'],
                },
                {
                    path: ROUTES.DETAILS,
                    component: DetailScreen,
                    widgets: ['sidemenu'],
                },
                {
                    path: ROUTES.CAROUSELS,
                    component: CarouselsScreen,
                    widgets: ['sidemenu'],
                },
                {
                    path: ROUTES.MODAL,
                    component: ModalScreen,
                },
            ],
        });
    }

    static _template(): Lightning.Component.Template<AppTemplateSpec> {
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

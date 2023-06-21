import SideMenu from './components/menu.lng';

declare module '@lightningjs/sdk' {
    namespace Lightning {
        namespace Application {}
    }

    namespace Application {}
    namespace Router {
        /**
         * Definitions of the app specific widgets
         */
        interface CustomWidgets {
            SideMenu: typeof SideMenu;
        }
    }
}

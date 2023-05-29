import { Launch } from '@lightningjs/sdk';

export const renderApp = (App: any) => {
    const Main = (...args: any) => Launch(App, ...args);
    return Main;
};

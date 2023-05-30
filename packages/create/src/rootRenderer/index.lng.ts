import { Lightning, Launch, PlatformSettings, AppData } from '@lightningjs/sdk';

export const renderApp = (App: any) => {
    const Main = (appSettings: Lightning.Application.Options, platformSettings: PlatformSettings, appData: AppData) =>
        Launch(App, appSettings, platformSettings, appData);
    return Main;
};

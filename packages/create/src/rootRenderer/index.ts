import 'react-native/Libraries/Core/InitializeCore';
import { AppRegistry, LogBox } from 'react-native';
//@ts-expect-error - this is not typed by @types/react-native
import immediateShim from 'react-native/Libraries/Core/Timers/immediateShim';
//@ts-expect-error - this is not typed by @types/react-native
import queueMicrotask from 'react-native/Libraries/Core/Timers/queueMicrotask';
import { FC } from 'react';

if (!global.setImmediate) {
    global.setImmediate = immediateShim.setImmediate;
}

if (!global.queueMicrotask) {
    global.queueMicrotask = queueMicrotask;
}

if (!global.performance) {
    // @ts-expect-error Performance needs to be typed
    global.performance = {};
}

if (typeof global.performance.now !== 'function') {
    global.performance.now = function () {
        const performanceNow = global.nativePerformanceNow || Date.now;
        return performanceNow();
    };
}

export const renderApp = (App: FC<any>, options?: { enableWarnings: boolean }) => {
    AppRegistry.registerComponent('App', () => App);
    if (options?.enableWarnings) {
        LogBox.ignoreAllLogs(); // Ignore all log notifications
    }

    try {
        const rns = require('react-native-screens');
        if (rns.enableScreens) {
            rns.enableScreens();
        }
    } catch (e) {
        // eslint-disable-next-line
        console.log('react-native-screens not installed. skipping enableScreens()');
    }
};

//@ts-nocheck
import 'react-native/Libraries/Core/InitializeCore';
import { AppRegistry, LogBox } from 'react-native';
import { enableScreens } from 'react-native-screens';
import immediateShim from 'react-native/Libraries/Core/Timers/immediateShim';
import queueMicrotask from 'react-native/Libraries/Core/Timers/queueMicrotask';
import App from '../index';

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

enableScreens();
LogBox.ignoreAllLogs(); // Ignore all log notifications

AppRegistry.registerComponent('App', () => App);

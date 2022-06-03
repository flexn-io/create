import { AppRegistry } from 'react-native';
import { enableScreens } from 'react-native-screens';
// import * as Sentry from '@sentry/react-native';
import JSTimers from 'react-native/Libraries/Core/Timers/JSTimers';
import App from '../app';
// import Package from '../../package.json';
// import { SENTRY_URL } from '../../renative.private.json';

if (!global.setImmediate) {
    // global.setImmediate = JSTimers.setImmediate;
}

// Sentry.init({
//     release: `harness-app@${Package.version}`,
//     dist: Package.version.replace(new RegExp(/([.,-]|alpha)/g), ''),
//     dsn: SENTRY_URL,
// });

enableScreens();
AppRegistry.registerComponent('App', () => App);

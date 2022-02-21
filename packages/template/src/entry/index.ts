import { AppRegistry, LogBox } from 'react-native';
import { enableScreens } from 'react-native-screens';
import JSTimers from 'react-native/Libraries/Core/Timers/JSTimers';
import App from '../app';

if (!global.setImmediate) {
    global.setImmediate = JSTimers.setImmediate;
}

enableScreens();
LogBox.ignoreAllLogs(); // Ignore all log notifications

AppRegistry.registerComponent('App', () => App);

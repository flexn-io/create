import { AppRegistry, LogBox } from 'react-native';
import App from '../app';

LogBox.ignoreAllLogs(); // Ignore all log notifications

AppRegistry.registerComponent('App', () => App);

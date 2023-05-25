import { Launch } from '@lightningjs/sdk';
import App from './src/entry/index.lng';

const Main = (...args) => Launch(App, ...args);

export default Main;

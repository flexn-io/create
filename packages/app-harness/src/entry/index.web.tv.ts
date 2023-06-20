import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../index';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(React.createElement(App));

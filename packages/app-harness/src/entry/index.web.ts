import * as React from 'react';
import { setFocusManagerEnabled } from '@flexn/create';
import { createRoot } from 'react-dom/client';
import App from '../index';

setFocusManagerEnabled(false);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(React.createElement(App));

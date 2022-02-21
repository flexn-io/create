import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import React from 'react';
import ReactDOM from 'react-dom';
import Package from '../../package.json';
import { SENTRY_URL } from '../../renative.private.json';
import App from '../app';

Sentry.init({
    release: `harness-app@${Package.version}`,
    dist: Package.version.replace(new RegExp(/([.,-]|alpha)/g), ''),
    dsn: SENTRY_URL,
    integrations: [new Integrations.BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
});

ReactDOM.render(React.createElement(App), document.getElementById('root'));

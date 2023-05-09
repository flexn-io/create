import React from 'react';
import { App, Debugger } from '@flexn/create';
import { ThemeProvider } from '../config';
import Navigation from '../navigation';

const MyApp = () => (
    <ThemeProvider>
        <App style={{ flex: 1 }}>
            <Navigation />
            <Debugger />
        </App>
    </ThemeProvider>
);

export default MyApp;

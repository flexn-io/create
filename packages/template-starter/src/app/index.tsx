import React from 'react';
import { App, Debugger } from '@flexn/create';
import { LogBox } from 'react-native';
import { ThemeProvider } from '../config';
import Navigation from '../navigation';

LogBox.ignoreAllLogs();

const MyApp = () => (
    <ThemeProvider>
        <App style={{ flex: 1 }}>
            <Navigation />
            <Debugger />
        </App>
    </ThemeProvider>
);

export default MyApp;

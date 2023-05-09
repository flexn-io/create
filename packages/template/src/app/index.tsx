import React from 'react';
import { App as SDKApp, Debugger } from '@flexn/create';
import { ThemeProvider } from '../config';
import Navigation from '../navigation';

const App = () => (
    <ThemeProvider>
        <SDKApp style={{ flex: 1 }}>
            <Navigation />
            <Debugger />
        </SDKApp>
    </ThemeProvider>
);

export default App;

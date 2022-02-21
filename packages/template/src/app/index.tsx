import React from 'react';
import { App as SDKApp } from '@flexn/sdk';
import { ThemeProvider } from '../config';
import Navigation from '../navigation';

const App = () => (
    <ThemeProvider>
        <SDKApp style={{ flex: 1 }}>
            <Navigation />
        </SDKApp>
    </ThemeProvider>
);

export default App;

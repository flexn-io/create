import React from 'react';
import { App, Debugger } from '@flexn/create';
import Navigation from './navigation';
import { DebugProvider } from './context/debugContext';

const Root = () => {
    return (
        <App style={{ flex: 1 }}>
            <DebugProvider>
                <Navigation />
                <Debugger />
            </DebugProvider>
        </App>
    );
};

export default Root;

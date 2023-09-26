import React from 'react';
import { LogBox } from 'react-native';
import { App as CreateApp, Debugger } from '@flexn/create';
import Home from './src/index';
import SideMenu from './src/components/SideMenu';

LogBox.ignoreAllLogs();

export default function App() {
    return (
        <CreateApp>
            <Home />
            <SideMenu />
            <Debugger />
        </CreateApp>
    );
}

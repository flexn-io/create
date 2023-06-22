import React from 'react';
import { Debugger, App } from '@flexn/create';
import Menu from '../components/menu';
import { themeStyles, ThemeProvider } from '../config';
import { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps<any>) {
    return (
        <ThemeProvider>
            <Menu />
            <App style={themeStyles.appContainer}>
                <Component {...pageProps} />
                <Debugger />
            </App>
        </ThemeProvider>
    );
}

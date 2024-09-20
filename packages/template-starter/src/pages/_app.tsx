import React from 'react';
import { Debugger, App } from '@flexn/create';
import Menu from '../components/menu';
import { themeStyles, ThemeProvider } from '../config';
import { AppProps } from 'next/app';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }: AppProps<any>) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <ThemeProvider>
                <Menu />
                <App style={themeStyles.appContainer}>
                    <Component {...pageProps} />
                    <Debugger />
                </App>
            </ThemeProvider>
        </>
    );
}

import React from 'react';
import { View } from '@flexn/create';
import Menu from '../components/menu';
import { themeStyles, ThemeProvider } from '../config';
import { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps<any>) {
    return (
        <ThemeProvider>
            <Menu />
            <View style={themeStyles.appContainer}>
                <Component {...pageProps} />
            </View>
        </ThemeProvider>
    );
}

import React from 'react';
import { View } from '@flexn/sdk';
import Menu from '../components/menu';
import { themeStyles, ThemeProvider } from '../config';

export default function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider>
            <Menu />
            <View style={themeStyles.appContainer}>
                <Component {...pageProps} />
            </View>
        </ThemeProvider>
    );
}

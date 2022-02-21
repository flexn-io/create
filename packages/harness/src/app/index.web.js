import { View } from '@flexn/sdk';
import { useRouter } from 'next/router';
import React from 'react';
import Menu from '../components/menu';
import { themeStyles } from '../config';

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();

    return (
        <View style={themeStyles.app}>
            <Menu focusKey="menu" router={router} />
            <View style={themeStyles.appContainer}>
                <Component {...pageProps} />
            </View>
        </View>
    );
}

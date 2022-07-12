import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';
// import { flush } from 'react-native-media-query';
// import { AppRegistry } from 'react-native-web';

class MyDocument extends Document {
    // static async getInitialProps({ renderPage }) {
    //     AppRegistry.registerComponent('Main', () => Main);
    //     const { getStyleElement } = AppRegistry.getApplication('Main');
    //     const { html, head } = renderPage();

    //     const styles = [getStyleElement(), flush()];
    //     return { html, head, styles: React.Children.toArray(styles) };
    // }

    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta name="description" content="Flexn SDK Example" />
                    <link rel="shortcut icon" href="/favicon.ico" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;

import type { DocumentContext, DocumentInitialProps } from 'next/document';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';
import { flush } from 'react-native-media-query';
//@ts-expect-error - react-native-web does not pick up types.d.ts
import { AppRegistry } from 'react-native-web';
class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
        AppRegistry.registerComponent('Main', () => Main);
        const { getStyleElement } = AppRegistry.getApplication('Main');
        const initialProps = await Document.getInitialProps(ctx);
        const { html, head } = await ctx.renderPage();

        const styles = [getStyleElement(), flush()];
        return { ...initialProps, html, head, styles: React.Children.toArray(styles) };
    }

    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta name="description" content="Flexn Create Example" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
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

import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';
import { CONFIG } from '../config';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta name="description" content={CONFIG.welcomeMessage} />
                    <link rel="shortcut icon" href="/favicon.ico" />
                    <script
                        type="text/javascript"
                        src="//www.gstatic.com/cast/sdk/libs/caf_receiver/v3/cast_receiver_framework.js"
                    ></script>
                    <script
                        type="text/javascript"
                        src="//www.gstatic.com/cast/sdk/libs/devtools/debug_layer/caf_receiver_logger.js"
                    ></script>
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

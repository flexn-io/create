/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require('path');
const process = require('process');
const {babel} = require('@rollup/plugin-babel');
const babelPluginClassProperties = require('@babel/plugin-proposal-class-properties');
const resolve = require('@rollup/plugin-node-resolve').nodeResolve;
const commonjs = require('@rollup/plugin-commonjs');
const alias = require('@rollup/plugin-alias');
const json = require('@rollup/plugin-json');
const virtual = require('@rollup/plugin-virtual');
const inject = require('@rollup/plugin-inject');
const image = require('@rollup/plugin-image');
const buildHelpers = require(path.join(__dirname, '../helpers/build'));
const dotenv = require('dotenv').config();
const minify = require('rollup-plugin-terser').terser;
const license = require('rollup-plugin-license');
const os = require('os');
const tsPlugin = require('@rollup/plugin-typescript');

module.exports = {
    onwarn(warning, warn) {
        if (warning.code !== 'CIRCULAR_DEPENDENCY') {
            warn(warning);
        }
    },
    plugins: [
        json(),
        image(),
        inject({
            'process.env': 'processEnv',
        }),
        virtual({
            processEnv: `export default ${JSON.stringify({
                NODE_ENV: process.env.NODE_ENV,
                ...buildHelpers.getEnvAppVars(dotenv.parsed),
            })}`,
        }),
        alias({
            entries: {
                'wpe-lightning': path.join(__dirname, '../alias/wpe-lightning.js'),
                '@lightningjs/core': path.join(__dirname, '../alias/lightningjs-core.js'),
                '@': path.resolve(process.cwd(), 'src/'),
                '~': path.resolve(process.cwd(), 'node_modules/'),
            },
        }),
        resolve({ mainFields: ['module', 'main', 'browser'], extensions: process.env.RNV_EXTENSIONS.split(',').map(extension => `.${extension}`) }),
        commonjs({ sourceMap: false }),
        babel({
            plugins: [babelPluginClassProperties],
        }),
        tsPlugin(),
        (process.env.LNG_BUILD_MINIFY === 'true' || process.env.NODE_ENV === 'production') &&
      minify({ keep_fnames: true }),
        license({
            banner: {
                content: [
                    'App version: <%= data.appVersion %>',
                    'SDK version: <%= data.sdkVersion %>',
                    'CLI version: <%= data.cliVersion %>',
                    '',
                    'Generated: <%= data.gmtDate %>',
                ].join(os.EOL),
                data() {
                    const date = new Date();
                    return {
                        appVersion: buildHelpers.getAppVersion(),
                        sdkVersion: buildHelpers.getSdkVersion(),
                        cliVersion: buildHelpers.getCliVersion(),
                        gmtDate: date.toGMTString(),
                    };
                },
            },
        }),
    ],
    output: {
        format: 'iife',
        inlineDynamicImports: true,
        sourcemap:
      process.env.NODE_ENV === 'production'
          ? true
          : process.env.LNG_BUILD_SOURCEMAP === undefined
              ? true
              : process.env.LNG_BUILD_SOURCEMAP === 'false'
                  ? false
                  : process.env.LNG_BUILD_SOURCEMAP,
    },
};

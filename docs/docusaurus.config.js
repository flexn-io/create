// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Flexn Create SDK',
    tagline: 'Multiplatform is easy',
    url: 'https://create.flexn.org',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'flexn-io', // Usually your GitHub org/user name.
    projectName: 'create', // Usually your repo name.
    plugins: [
        [
            '@docusaurus/plugin-google-gtag',
            {
                trackingID: 'G-PLQDGZ71YX',
            },
        ],
    ],
    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    editUrl: 'https://github.com/flexn-io/create',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],
    stylesheets: ['https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=block'],
    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            navbar: {
                logo: {
                    alt: 'Flexn Logo',
                    src: 'img/create-logo.svg',
                },
                items: [
                    {
                        type: 'doc',
                        docId: 'introduction',
                        position: 'left',
                        label: 'Docs',
                    },
                    // { type: 'doc', docId: 'api/intro', label: 'API', position: 'left' },
                    { type: 'doc', docId: 'changelog/CHANGELOG', label: 'Changelog', position: 'left' },
                    {
                        href: 'https://flexn.org',
                        label: 'Flexn',
                        position: 'right',
                        target: '_self',
                    },
                    {
                        href: 'https://github.com/flexn-io/create',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'light',
                logo: {
                    alt: 'Flexn logo',
                    src: 'img/flexn-logo-full.svg',
                    href: 'https://flexn.io',
                    width: 100,
                    height: 30,
                },
                copyright: `© ${new Date().getFullYear()} Flexn B.V. All rights reserved.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
};

// TODO. We need designs for the home page and navbar in dark mode before enabling it back
config.themeConfig.colorMode = {
    defaultMode: 'light',
    disableSwitch: true,
};

module.exports = config;

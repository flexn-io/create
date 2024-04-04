//! NO CONSOLE LOGS HERE. IT WILL BREAK THE APP
const { withRNVRNConfig } = require('@rnv/adapter');

const config = withRNVRNConfig({
    dependencies: {
        // !TODO workaround for ios. This should be removed once it's properly fixed. tracked here https://github.com/flexn-io/create/issues/195
        'react-native-vector-icons': {
            platforms: {
                ios: null,
            },
        },
    },
});

module.exports = config;

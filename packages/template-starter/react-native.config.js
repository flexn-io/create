//! NO CONSOLE LOGS HERE. IT WILL BREAK THE APP
const { withRNVRNConfig } = require('rnv');

const config = withRNVRNConfig({
    dependencies: {
        'react-native-vector-icons': {
            platforms: {
                ios: null,
            },
        },
    },
});

module.exports = config;

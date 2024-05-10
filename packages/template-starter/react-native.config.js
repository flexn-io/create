//! NO CONSOLE LOGS HERE. IT WILL BREAK THE APP
const { withRNVRNConfig } = require('@rnv/adapter');

module.exports = withRNVRNConfig({
    dependencies: {
        'react-native-vector-icons': {
            platforms: {
                ios: null,
            },
        },
    }
});

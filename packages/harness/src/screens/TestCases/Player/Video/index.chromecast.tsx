import React from 'react';
import { Text, View } from 'react-native';
import { themeStyles } from '../../../../config';

const VideoPlayerTest = () => (
    <View style={[themeStyles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={themeStyles.textH2}> Player Test 2 (Video) </Text>
    </View>
);

export default VideoPlayerTest;

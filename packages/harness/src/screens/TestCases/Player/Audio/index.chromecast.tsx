// separated in case we want to use different player for audio only. rn-video might not be the best choice, i'm not sure
import React from 'react';
import { Text, View } from 'react-native';
import { themeStyles } from '../../../../config';

const AudioPlayerTest = () => (
    <View style={[themeStyles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={themeStyles.textH2}>Player Test 1 (Audio)</Text>
    </View>
);

export default AudioPlayerTest;

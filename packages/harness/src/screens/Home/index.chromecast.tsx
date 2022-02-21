import { Image, ScrollView, Text, View } from '@flexn/sdk';
import React from 'react';
import { ICON_LOGO, themeStyles, CONFIG } from '../../config';

const ScreenMyPage = () => (
    <View style={themeStyles.screen}>
        <ScrollView contentContainerStyle={themeStyles.container}>
            <Image style={themeStyles.image} source={ICON_LOGO} />
            <Text style={themeStyles.textH2}>Choose a test case on your handheld device</Text>
        </ScrollView>
        <Text style={{ position: 'absolute', top: 25, right: 10, color: 'white' }}>
            Version: {CONFIG.appVersion} Built: {CONFIG.timestamp}
        </Text>
    </View>
);

export default ScreenMyPage;

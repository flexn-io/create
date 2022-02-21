import { Text, View } from '@flexn/sdk';
import React from 'react';
import { themeStyles } from '../../../../config';

const ImageGalleryCastTest = () => (
    <View style={[themeStyles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={themeStyles.textH2}> Cast Test 1 (Image Gallery) </Text>
    </View>
);

export default ImageGalleryCastTest;

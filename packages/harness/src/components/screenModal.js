import { ScrollView, Text, View } from '@flexn/sdk';
import React from 'react';
import { Button, usePop } from '@rnv/renative';
import Theme, { themeStyles } from '../config';
import { testProps } from '../utils';

const ScreenModal = (props) => {
    const pop = usePop(props);

    return (
        <View style={themeStyles.screenModal}>
            <View style={themeStyles.modalHeader}>
                <Button
                    focusKey="close"
                    iconFont="ionicons"
                    iconName="md-close-circle"
                    iconColor={Theme.color3}
                    iconSize={Theme.iconSize}
                    style={themeStyles.icon}
                    // to="/"
                    onEnterPress={() => {
                        pop();
                    }}
                    onPress={() => {
                        pop();
                    }}
                    {...testProps('flexn-components-button-screen-modal-close-button')}
                />
            </View>
            <ScrollView contentContainerStyle={themeStyles.container}>
                <Text style={themeStyles.textH2}>This is my Modal!</Text>
            </ScrollView>
        </View>
    );
};

export default ScreenModal;

import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { themeStyles } from '../../../../config';
import { testProps } from '../../../../utils';

const ScreenHome = () => {
    const [visible, setModalVisible] = useState(false);

    return (
        <View style={[themeStyles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={themeStyles.textH2}>Focus Test 4 (Modal behavior)</Text>
            <TouchableOpacity
                style={[
                    themeStyles.button,
                    { width: 500, height: 200, alignItems: 'center', justifyContent: 'center' },
                ]}
                onPress={() => setModalVisible(true)}
                hasTVPreferredFocus
                {...testProps('flexn-screens-focus-modal-behaviour-open-modal')}
            >
                <Text style={themeStyles.textH3}>OPEN MODAL</Text>
            </TouchableOpacity>
            <Modal
                visible={visible}
                onRequestClose={() => setModalVisible(false)}
                hardwareAccelerated
                animationType="slide"
                {...testProps('flexn-screens-focus-modal-behaviour-modal-visible')}
            >
                <View style={[themeStyles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
                    <View style={{ width: '75%', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={themeStyles.button}
                            onPress={() => setModalVisible(false)}
                            {...testProps('flexn-screens-focus-modal-behaviour-close-modal-1')}
                        />
                        <TouchableOpacity
                            style={themeStyles.button}
                            onPress={() => setModalVisible(false)}
                            {...testProps('flexn-screens-focus-modal-behaviour-close-modal-2')}
                        />
                    </View>
                    <View style={{ width: '75%', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={themeStyles.button}
                            onPress={() => setModalVisible(false)}
                            {...testProps('flexn-screens-focus-modal-behaviour-close-modal-3')}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};
export default ScreenHome;

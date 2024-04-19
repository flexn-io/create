import React, { useContext } from 'react';
import { Text, View, TouchableOpacity } from '@flexn/create';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../config';
import { usePop } from '../hooks';
import Screen from './screen';
import { testProps } from '../utils';

const ScreenModal = ({ navigation }: { navigation?: any }) => {
    const pop = usePop({ navigation });
    const { theme } = useContext(ThemeContext);

    return (
        <Screen
            style={[theme.styles.screenModal]}
            focusOptions={{
                screenOrder: 1,
            }}
        >
            <View style={theme.styles.modalHeader}>
                <TouchableOpacity
                    onPress={() => pop()}
                    style={theme.styles.icon}
                    focusOptions={{ hasPreferredFocus: true }}
                    {...testProps('template-modal-screen-close-button')}
                >
                    <Icon name="close" size={theme.static.iconSize} color={theme.static.colorBrand} />
                </TouchableOpacity>
            </View>
            <View style={[theme.styles.container, { flex: 1 }]}>
                <Text style={theme.styles.textH2}>This is my Modal!</Text>
            </View>
        </Screen>
    );
};

export default ScreenModal;

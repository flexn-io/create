import React from 'react';
import { View, StyleSheet } from '@flexn/create';
import Screen from './../screen';
import { Ratio } from '../../utils';
import { NavigationProps } from '../../navigation';
import { Button } from '../../components/Button';

const PreferredFocus = ({ route }: NavigationProps) => {
    return (
        <Screen style={{ backgroundColor: '#222222' }} route={route}>
            <View style={{ top: Ratio(20), flex: 1 }}>
                <Button testID="PF1-B1" title="B1" style={styles.btn1} />
                <Button testID="PF1-B2" title="B2" style={styles.btn2} />
                <Button testID="PF1-B3" title="B3" style={styles.btn3} />
                <Button testID="PF1-B4" title="B4" style={styles.btn4} focusOptions={{ hasPreferredFocus: true }} />
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    btn1: {
        position: 'absolute',
    },
    btn2: {
        position: 'absolute',
        left: Ratio(600),
    },
    btn3: {
        position: 'absolute',
        top: Ratio(200),
    },
    btn4: {
        position: 'absolute',
        left: Ratio(600),
        top: Ratio(200),
    },
});

PreferredFocus.id = 'PF1';
PreferredFocus.platform = ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'];
PreferredFocus.route = 'PreferredFocus';
PreferredFocus.title = 'Preferred Focus';
PreferredFocus.description =
    'Once page is loaded initial focus instead of B1 should be placed on B4 without any remote actions.';

export default PreferredFocus;

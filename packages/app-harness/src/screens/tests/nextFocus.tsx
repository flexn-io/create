import React from 'react';
import { View, StyleSheet } from '@flexn/create';
import Screen from './../screen';
import { Ratio } from '../../utils';
import { NavigationProps } from '../../navigation';
import { Button } from '../../components/Button';

const NextFocus = ({ route }: NavigationProps) => {
    return (
        <Screen style={{ backgroundColor: '#222222' }} route={route}>
            <View style={{ top: Ratio(20), flex: 1 }}>
                <Button
                    testID="NF1-B1"
                    title="B1"
                    focusOptions={{ focusKey: 'b1', nextFocusDown: 'b4' }}
                    style={styles.btn1}
                />
                <Button
                    testID="NF1-B2"
                    title="B2"
                    focusOptions={{ focusKey: 'b2', nextFocusLeft: 'b3' }}
                    style={styles.btn2}
                />
                <Button
                    testID="NF1-B3"
                    title="B3"
                    focusOptions={{ focusKey: 'b3', nextFocusRight: 'b2' }}
                    style={styles.btn3}
                />
                <Button
                    testID="NF1-B4"
                    title="B4"
                    focusOptions={{ focusKey: 'b4', nextFocusUp: 'b1' }}
                    style={styles.btn4}
                />
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

NextFocus.id = 'NF1';
NextFocus.platform = ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'];
NextFocus.route = 'NextFocus';
NextFocus.title = 'Next Focus';
NextFocus.description = `When B1 is focused and down remote event is pressed B4 should be focused. 
When B2 is focused and left remote event is pressed B3 should be focused. 
When B3 is focused and right remote event is pressed B2 should be focused.
When B4 is focused and up remote event is pressed B1 should be focused.
`;

export default NextFocus;

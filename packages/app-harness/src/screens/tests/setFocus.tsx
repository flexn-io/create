import React from 'react';
import { View, setFocus } from '@flexn/create';
import Screen from './../screen';
import { Ratio } from '../../utils';
import { NavigationProps } from '../../navigation';
import { Button } from '../../components/Button';

const SetFocus = ({ route }: NavigationProps) => {
    return (
        <Screen style={{ backgroundColor: '#222222' }} route={route}>
            <View style={{ top: Ratio(20), flex: 1 }}>
                <Button testID="SF1-B1" title="B1" onPress={() => setFocus('b3')} />
                <Button testID="SF1-B2" title="B2" onPress={() => setFocus('b4')} />
                <Button testID="SF1-B3" title="B3" focusOptions={{ focusKey: 'b3' }} />
                <Button testID="SF1-B4" title="B4" focusOptions={{ focusKey: 'b4' }} />
            </View>
        </Screen>
    );
};

SetFocus.id = 'SF1';
SetFocus.platform = ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'];
SetFocus.route = 'SetFocus';
SetFocus.title = 'Set Focus';
SetFocus.description = 'When B1 is pressed focus is set to B3. When B2 is pressed focus is set to B4';

export default SetFocus;

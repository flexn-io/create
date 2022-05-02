import { ScrollView, Text, View } from '@flexn/sdk';
import * as Sentry from '@sentry/react-native';
import React from 'react';
import { useNavigate } from '../../hooks/navigation';
import { Button } from '../../components/Button';
import Screen from '../../components/Screen';
import { themeStyles, CONFIG } from '../../config';
import { CastButton, testProps } from '../../utils';
import CategorizedTestCases from '../TestCases';
import TestCaseList from './TestCaseList';

const testCaseCategoryColors = ['teal', 'orange', 'cornflowerblue', 'coral', 'chocolate'];

const ScreenHome = (props) => {
    const navigate = useNavigate(props);

    return (
        <Screen style={themeStyles.screen} focusOptions={{ verticalWindowAlignment: 'both-edge' }}>
            <ScrollView contentContainerStyle={themeStyles.container}>
                {/* TODO Remove this block once we know Sentry crash reporting works */}
                <View
                    style={{
                        width: '80%',
                        alignItems: 'center',
                        padding: 15,
                        marginVertical: 10,
                    }}
                >
                    <Button
                        style={[themeStyles.button, { borderColor: 'red' }]}
                        textStyle={[themeStyles.buttonText, { color: 'red' }]}
                        title="Crash the App!"
                        onPress={() => Sentry.nativeCrash()}
                        {...testProps('flexn-screens-home-test-case-list-button-sentry-crash')}
                    />
                </View>
                {/* End of removable block */}
                {Object.entries(CategorizedTestCases).map(([testCasesCategory, testCases], idx) => (
                    <TestCaseList
                        key={testCasesCategory}
                        category={testCasesCategory}
                        testCases={testCases}
                        color={testCaseCategoryColors[idx]}
                        onButtonFocus={() => {
                            //todo
                        }}
                        navigate={navigate}
                        groupID={idx}
                        parentContext={{}}
                    />
                ))}
            </ScrollView>
            <Text style={{ position: 'absolute', top: 25, right: 10, color: 'white' }}>
                Version: {CONFIG.appVersion} Built: {CONFIG.timestamp}
            </Text>
            <CastButton
                // @ts-expect-error TODO fix
                style={{
                    width: 48,
                    height: 48,
                    marginRight: 48,
                    tintColor: '#ffffff',
                }}
            />
        </Screen>
    );
};

export default ScreenHome;

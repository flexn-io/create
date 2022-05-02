/* eslint-disable no-undef */
import { ScrollView, Text, View } from '@flexn/sdk';
import React, { useState } from 'react';
import { useNavigate } from '@rnv/renative';
// @ts-expect-error will only exist after rnv run
import runtime from '../../../platformAssets/renative.runtime.json';
import { Button } from '../../components/Button';
import { themeStyles } from '../../config';
import { testProps } from '../../utils';
import CategorizedTestCases from '../TestCases';
import TestCaseList from './TestCaseList';

const testCaseCategoryColors = ['teal', 'orange', 'cornflowerblue', 'coral', 'chocolate'];

const ScreenHome = (props) => {
    const [shouldAppCrash, setAppToCrash] = useState(false);
    const navigate = useNavigate(props);

    return (
        <View style={themeStyles.screen}>
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
                        onPress={() => setAppToCrash(true)}
                        {...testProps('flexn-screens-home-test-case-list-button-sentry-crash')}
                    />
                    {/* @ts-expect-error supposed to crash because of undefined */}
                    {shouldAppCrash && <Button onPress={crashingTestMethod} />}
                </View>
                {/* End of removable block */}
                {Object.entries(CategorizedTestCases).map(([testCasesCategory, testCases], idx) => (
                    <TestCaseList
                        key={testCasesCategory}
                        category={testCasesCategory}
                        testCases={testCases}
                        color={testCaseCategoryColors[idx]}
                        navigate={navigate}
                        groupID={idx}
                    />
                ))}
            </ScrollView>
            <Text style={{ position: 'absolute', top: 25, right: 10, color: 'white' }}>
                Version: {runtime.appVersion} Built: {runtime.timestamp}
            </Text>
        </View>
    );
};

export default ScreenHome;

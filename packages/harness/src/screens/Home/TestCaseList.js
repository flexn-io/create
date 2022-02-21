import { Text, View } from '@flexn/sdk';
import React from 'react';
import { Button } from '../../components/Button';
import { themeStyles } from '../../config';
import { testProps } from '../../utils';

// navigate is coming from renative's useNavigate. since it requires quite a few props coming
// from the screen, thought it will be simpler to pass single prop instead of 4 or so. delete if useNavigate is not used anymore
function TestCaseList({ category, testCases, color, onButtonFocus, navigate, groupID, parentContext }) {
    const renderTestCases = () => {
        const testCaseKeys = Object.keys(testCases);

        if (!testCaseKeys.length)
            return <Text style={[themeStyles.textH3, { color }]}>There are no test cases yet</Text>;

        return testCaseKeys.map((testCase, index) => (
            <Button
                key={testCase}
                style={[themeStyles.button, { borderColor: color }]}
                textStyle={[themeStyles.buttonText, { color }]}
                title={testCase}
                onPress={() => navigate(testCase, '/[slug]')}
                onEnterPress={() => navigate(testCase, '/[slug]')}
                onBecameFocused={onButtonFocus}
                {...testProps(`flexn-screens-home-test-case-list-button-${groupID}-${index}`)}
            />
        ));
    };

    return (
        <View
            parentContext={parentContext}
            style={{
                width: '80%',
                alignItems: 'center',
                padding: 15,
                marginVertical: 10,
            }}
        >
            <Text style={themeStyles.textH2}>{category}</Text>
            {renderTestCases()}
        </View>
    );
}

export default TestCaseList;

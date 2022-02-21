// /* eslint-disable react-hooks/rules-of-hooks */

import { ScrollView, Text, View } from '@flexn/sdk';
import * as Sentry from '@sentry/react-native';
import React, { useEffect, useState } from 'react';
import { PixelRatio } from 'react-native';
import { CarPlay, GridTemplate } from 'react-native-carplay';
import { CastButton } from 'react-native-google-cast';
import { Api, useNavigate } from 'renative';
import { Button } from '../../components/Button';
import { CONFIG, themeStyles } from '../../config';
import { testProps } from '../../utils';
import CategorizedTestCases from '../TestCases';
import TestCaseList from './TestCaseList';

const testCaseCategoryColors = ['teal', 'orange', 'cornflowerblue', 'coral', 'chocolate'];

const ScreenHome = (props: any) => {
    const [carPlayConnected, setCarPlayConnected] = useState(CarPlay.connected);
    const navigate = useNavigate(props);

    useEffect(() => {
        const { navigation } = props;
        function onConnect() {
            setCarPlayConnected(true);
        }

        function onDisconnect() {
            setCarPlayConnected(false);
        }

        CarPlay.registerOnConnect(onConnect);
        CarPlay.registerOnDisconnect(onDisconnect);

        const gridTemplate = new GridTemplate({
            buttons: [
                {
                    id: 'root',
                    titleVariants: ['Go Back to Home'],
                    // eslint-disable-next-line global-require
                    image: require('../../../static/images/logo.png'),
                },
                {
                    id: 'focusTest1',
                    titleVariants: ['Try Me'],
                    // eslint-disable-next-line global-require
                    image: require('../../../static/images/logo.png'),
                },
                {
                    id: 'focusTest2',
                    titleVariants: ['Now Try Me'],
                    // eslint-disable-next-line global-require
                    image: require('../../../static/images/logo.png'),
                },
            ],
            onButtonPressed: ({ id }: { id: string }) => {
                navigation.navigate(id);
            },
            onWillAppear: () => {
                navigation.navigate('root');
            },
            title: 'Hello from ReNative!',
        });

        CarPlay.setRootTemplate(gridTemplate);

        return () => {
            CarPlay.unregisterOnConnect(onConnect);
            CarPlay.unregisterOnDisconnect(onDisconnect);
        };
    }, []);

    return (
        <View style={themeStyles.screen}>
            <ScrollView contentContainerStyle={themeStyles.container}>
                <View
                    style={{
                        alignItems: 'flex-start',
                        paddingBottom: 15,
                    }}
                >
                    <Text style={themeStyles.textH2}>{CONFIG.welcomeMessage}</Text>
                    <Text style={themeStyles.textH3}>
                        {`platform: ${Api.platform}, factor: ${Api.formFactor}, engine: ${Api.engine}`}
                    </Text>
                    <Text style={themeStyles.textH3}>
                        {`pixelRatio: ${PixelRatio.get()}, ${PixelRatio.getFontScale()}`}
                    </Text>
                    <Text style={themeStyles.textH3}>{`CarPlay connected: ${carPlayConnected ? 'yes' : 'no'}`}</Text>
                </View>
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
                    // @ts-expect-error TODO type
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
                Version: {CONFIG.appVersion} Built: {CONFIG.timestamp}
            </Text>
            <CastButton
                style={{
                    width: 48,
                    height: 48,
                    marginRight: 48,
                    tintColor: '#ffffff',
                }}
            />
        </View>
    );
};

export default ScreenHome;

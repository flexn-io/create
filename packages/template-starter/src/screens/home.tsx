import React, { useContext, useRef } from 'react';
import { ScrollView as RNScrollView, useWindowDimensions } from 'react-native';
import { Text, View, ScrollView, TouchableOpacity, Image, ANIMATION_TYPES, AnimatorBackground } from '@flexn/create';
import { Api } from '@rnv/renative';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ROUTES, ICON_LOGO, ThemeContext } from '../config';
import { useNavigate, useOpenURL } from '../hooks';
import { testProps } from '../utils';
import Screen from './screen';
import packageJson from '../../package.json';

const ScreenHome = ({ navigation }: { navigation?: any }) => {
    const { height } = useWindowDimensions();
    const swRef = useRef<RNScrollView>() as React.MutableRefObject<RNScrollView>;
    const navigate = useNavigate({ navigation });
    const openURL = useOpenURL();

    const { theme, toggle } = useContext(ThemeContext);

    const focusAnimation: AnimatorBackground = {
        type: ANIMATION_TYPES.BACKGROUND as AnimatorBackground['type'],
        focus: {
            backgroundColor: theme.static.colorBrand,
        },
    };

    return (
        <Screen
            style={[theme.styles.screen, { minHeight: height }]}
            focusOptions={{ verticalWindowAlignment: 'low-edge', focusKey: 'page' }}
        >
            <ScrollView
                style={{ backgroundColor: theme.static.colorBgPrimary }}
                ref={swRef}
                contentContainerStyle={theme.styles.container}
            >
                <Image
                    style={theme.styles.image}
                    source={ICON_LOGO}
                    {...testProps('template-home-screen-flexn-image')}
                />
                <Text style={theme.styles.textH1} {...testProps('template-home-screen-welcome-message-text')}>
                    {'Flexn Create Example'}{' '}
                </Text>
                <Text style={theme.styles.textH2} {...testProps('template-home-screen-version-number-text')}>
                    v {packageJson.version}{' '}
                </Text>
                <Text style={theme.styles.textH3}>{`platform: ${Api.platform}`}</Text>
                <Text style={theme.styles.textH3}>{`factor: ${Api.formFactor}`}</Text>
                <Text style={theme.styles.textH3}>{`engine: ${Api.engine}`}</Text>
                <TouchableOpacity
                    onPress={toggle}
                    onFocus={() => {
                        if (swRef.current) swRef.current.scrollTo({ y: 0 });
                    }}
                    style={theme.styles.button}
                    focusOptions={{
                        nextFocusLeft: 'side-menu',
                        animator: focusAnimation,
                        forbiddenFocusDirections: ['up'],
                    }}
                    {...testProps('template-home-screen-try-me-button')}
                >
                    <Text style={theme.styles.buttonText}>Try Me!</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigate(ROUTES.CAROUSELS)}
                    style={theme.styles.button}
                    focusOptions={{
                        nextFocusLeft: 'side-menu',
                        nextFocusDown: 'chrome-icon',
                        animator: focusAnimation,
                    }}
                    {...testProps('template-home-screen-now-try-me-button')}
                >
                    <Text style={theme.styles.buttonText}>Now Try Me!</Text>
                </TouchableOpacity>
                <Text style={[theme.styles.textH3, { marginTop: 20 }]}>Explore more</Text>
                <View style={{ marginTop: 10, flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => openURL('https://github.com/flexn-io/create')}
                        style={theme.styles.icon}
                        focusOptions={{
                            forbiddenFocusDirections: ['left'],
                        }}
                        {...testProps('template-home-screen-github-button')}
                    >
                        <Icon name="github" size={theme.static.iconSize} color={theme.static.colorBrand} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => openURL('https://create.flexn.org')}
                        style={theme.styles.icon}
                        focusOptions={{
                            focusKey: 'chrome-icon',
                        }}
                        {...testProps('template-home-screen-chrome-button')}
                    >
                        <Icon name="chrome" size={theme.static.iconSize} color={theme.static.colorBrand} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => openURL('https://twitter.com/flexn_io')}
                        style={theme.styles.icon}
                        focusOptions={{
                            forbiddenFocusDirections: ['right'],
                        }}
                        {...testProps('template-home-screen-twitter-button')}
                    >
                        <Icon name="twitter" size={theme.static.iconSize} color={theme.static.colorBrand} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Screen>
    );
};

export default ScreenHome;

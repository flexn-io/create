import React, { useContext, useRef } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image, ANIMATION_TYPES } from '@flexn/sdk';
import { Api } from '@rnv/renative';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ROUTES, ICON_LOGO, ThemeContext } from '../config';
import { useNavigate, useOpenURL } from '../hooks';
import { testProps } from '../utils';
import Screen from './screen';
import packageJson from '../../package.json';

const ScreenHome = ({ navigation }: { navigation?: any }) => {
    const swRef = useRef<ScrollView>() as React.MutableRefObject<ScrollView>;
    const navigate = useNavigate({ navigation });
    const openURL = useOpenURL();

    const { theme, toggle } = useContext(ThemeContext);

    const focusAnimation = {
        type: ANIMATION_TYPES.BACKGROUND,
        backgroundColorFocus: theme.static.colorBrand,
    };

    return (
        <Screen style={theme.styles.screen} focusOptions={{ verticalWindowAlignment: 'both-edge' }}>
            <ScrollView
                style={{ backgroundColor: theme.static.colorBgPrimary }}
                ref={swRef}
                contentContainerStyle={theme.styles.container}
            >
                <Image style={theme.styles.image} source={ICON_LOGO} />
                <Text style={theme.styles.textH1}>{'Flexn SDK Example'}</Text>
                <Text style={theme.styles.textH2}>v {packageJson.version}</Text>
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
                        animatorOptions: focusAnimation,
                        forbiddenFocusDirections: ['up'],
                    }}
                    {...testProps('template-screen-home-try-me-button')}
                >
                    <Text style={theme.styles.buttonText}>Try Me!</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigate(ROUTES.CAROUSELS)}
                    style={theme.styles.button}
                    focusOptions={{
                        nextFocusLeft: 'side-menu',
                        animatorOptions: focusAnimation,
                    }}
                    {...testProps('template-screen-home-now-try-me-button')}
                >
                    <Text style={theme.styles.buttonText}>Now Try Me!</Text>
                </TouchableOpacity>
                <Text style={[theme.styles.textH3, { marginTop: 20 }]}>Explore more</Text>
                <View style={{ marginTop: 10, flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => openURL('https://github.com/flexn-io/flexn')}
                        style={theme.styles.icon}
                        focusOptions={{
                            forbiddenFocusDirections: ['left'],
                        }}
                        {...testProps('template-screen-home-navigate-to-github')}
                    >
                        <Icon name="github" size={theme.static.iconSize} color={theme.static.colorBrand} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => openURL('https://sdk.flexn.org')}
                        style={theme.styles.icon}
                        {...testProps('template-screen-home-navigate-to-renative')}
                    >
                        <Icon name="chrome" size={theme.static.iconSize} color={theme.static.colorBrand} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => openURL('https://twitter.com/flexn_io')}
                        style={theme.styles.icon}
                        focusOptions={{
                            forbiddenFocusDirections: ['right'],
                        }}
                        {...testProps('template-screen-home-navigate-to-twitter')}
                    >
                        <Icon name="twitter" size={theme.static.iconSize} color={theme.static.colorBrand} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Screen>
    );
};

export default ScreenHome;

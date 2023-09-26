import React from 'react';
import { Dimensions } from 'react-native';
import { Text, Pressable, StyleSheet, Screen, View, Animated } from '@flexn/create';
import SvgUri from 'react-native-svg-uri';
import LinearGradient from 'react-native-linear-gradient';
import { Ratio } from '../utils';

const { height } = Dimensions.get('screen');
const AnimatedView = Animated.createAnimatedComponent(View);

const SideMenu = () => {
    const translateX = React.useRef(new Animated.Value(-Ratio(800))).current;

    const [focusedMenuItem, setFocusedMenuItem] = React.useState('Home');

    const onFocus = () => {
        Animated.timing(translateX, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const onBlur = () => {
        Animated.timing(translateX, {
            toValue: -Ratio(800),
            duration: 300,
            useNativeDriver: false,
        }).start(() => {
            setFocusedMenuItem('Home');
        });
    };

    return (
        <Screen
            style={styles.container}
            onFocus={onFocus}
            onBlur={onBlur}
            focusOptions={{ focusKey: 'side-menu', nextFocusRight: 'home', forbiddenFocusDirections: ['up', 'down'] }}
        >
            <View style={styles.top}>
                <SvgUri
                    source={require('../assets/icons/Flexn-Create-monogram.svg')}
                    fill="white"
                    width={Ratio(48)}
                    height={Ratio(48)}
                />
            </View>
            <View style={styles.middle}>
                <Pressable onFocus={() => setFocusedMenuItem('Home')}>
                    <SvgUri
                        source={require('../assets/icons/home.svg')}
                        fill={focusedMenuItem === 'Home' ? '#7BB8F9' : '#FFFFFF'}
                        width={Ratio(38)}
                        height={Ratio(38)}
                    />
                    <AnimatedView style={{ position: 'absolute', transform: [{ translateX: translateX }] }}>
                        <Text style={[styles.menuItemTitle, focusedMenuItem === 'Home' && styles.menuItemTitleFocused]}>
                            Home
                        </Text>
                    </AnimatedView>
                </Pressable>
                <Pressable style={{ top: Ratio(102) }} onFocus={() => setFocusedMenuItem('Search')}>
                    <SvgUri
                        source={require('../assets/icons/search.svg')}
                        fill={focusedMenuItem === 'Search' ? '#7BB8F9' : '#FFFFFF'}
                        width={Ratio(38)}
                        height={Ratio(38)}
                    />
                    <AnimatedView style={{ position: 'absolute', transform: [{ translateX: translateX }] }}>
                        <Text
                            style={[styles.menuItemTitle, focusedMenuItem === 'Search' && styles.menuItemTitleFocused]}
                        >
                            Search
                        </Text>
                    </AnimatedView>
                </Pressable>
                <Pressable style={{ top: Ratio(204) }} onFocus={() => setFocusedMenuItem('Library')}>
                    <SvgUri
                        source={require('../assets/icons/Playlist.svg')}
                        fill={focusedMenuItem === 'Library' ? '#7BB8F9' : '#FFFFFF'}
                        width={Ratio(38)}
                        height={Ratio(38)}
                    />
                    <AnimatedView style={{ position: 'absolute', transform: [{ translateX: translateX }] }}>
                        <Text
                            style={[styles.menuItemTitle, focusedMenuItem === 'Library' && styles.menuItemTitleFocused]}
                        >
                            Library
                        </Text>
                    </AnimatedView>
                </Pressable>
                <Pressable style={{ top: Ratio(306) }} onFocus={() => setFocusedMenuItem('Settings')}>
                    <SvgUri
                        source={require('../assets/icons/Settings.svg')}
                        fill={focusedMenuItem === 'Settings' ? '#7BB8F9' : '#FFFFFF'}
                        width={Ratio(38)}
                        height={Ratio(38)}
                    />
                    <AnimatedView style={{ position: 'absolute', transform: [{ translateX: translateX }] }}>
                        <Text
                            style={[
                                styles.menuItemTitle,
                                focusedMenuItem === 'Settings' && styles.menuItemTitleFocused,
                            ]}
                        >
                            Settings
                        </Text>
                    </AnimatedView>
                </Pressable>
            </View>
            <View style={styles.bottom}>
                <Pressable onFocus={() => setFocusedMenuItem('Notifications')}>
                    <SvgUri
                        source={require('../assets/icons/Notifications.svg')}
                        fill={focusedMenuItem === 'Notifications' ? '#7BB8F9' : '#FFFFFF'}
                        width={Ratio(38)}
                        height={Ratio(38)}
                    />
                    <AnimatedView style={{ position: 'absolute', transform: [{ translateX: translateX }] }}>
                        <Text
                            style={[
                                styles.menuItemTitle,
                                focusedMenuItem === 'Notifications' && styles.menuItemTitleFocused,
                            ]}
                        >
                            Notifications
                        </Text>
                    </AnimatedView>
                </Pressable>
            </View>
            <AnimatedView style={{ ...styles.animatedView, transform: [{ translateX: translateX }] }}>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={['#000000', '#000000CC', '#00000000']}
                    style={styles.linearGradient}
                />
            </AnimatedView>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        width: Ratio(228),
        height,
        position: 'absolute',
        zIndex: 999,
        alignItems: 'center',
    },
    menuItemTitle: {
        fontFamily: 'Inter',
        fontSize: Ratio(32),
        color: 'white',
        position: 'absolute',
        width: Ratio(300),
        left: Ratio(70),
    },
    menuItemTitleFocused: {
        color: '#7BB8F9',
        fontWeight: '700',
    },
    linearGradient: {
        height,
        width: Ratio(800),
        position: 'absolute',
        top: 0,
    },
    top: {
        position: 'absolute',
        top: Ratio(96),
        zIndex: 999,
    },
    middle: {
        position: 'absolute',
        top: Ratio(368),
        zIndex: 999,
    },
    bottom: {
        position: 'absolute',
        top: Ratio(978),
        zIndex: 999,
    },
    animatedView: {
        height,
        position: 'absolute',
        top: 0,
        left: 0,
    },
});

export default SideMenu;

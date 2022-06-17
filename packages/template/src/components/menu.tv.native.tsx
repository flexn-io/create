import React, { useContext, useRef } from 'react';
import { Animated } from 'react-native';
import { TouchableOpacity, Text, Screen } from '@flexn/sdk';
import { testProps } from '../utils';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext, ROUTES, Ratio } from '../config';
import { useNavigate } from '../hooks';

const AnimatedText = Animated.createAnimatedComponent(Text);

const TRANSLATE_VAL_HIDDEN = Ratio(-300);

const Menu = ({ navigation }) => {
    const navigate = useNavigate({ navigation });
    const { theme } = useContext(ThemeContext);

    const translateBgAnim = useRef(new Animated.Value(TRANSLATE_VAL_HIDDEN)).current;
    const opacityAnim = [
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
    ];
    const translateTextAnim = [
        useRef(new Animated.Value(TRANSLATE_VAL_HIDDEN)).current,
        useRef(new Animated.Value(TRANSLATE_VAL_HIDDEN)).current,
        useRef(new Animated.Value(TRANSLATE_VAL_HIDDEN)).current,
    ];

    const timing = (object: Animated.AnimatedValue, toValue: number, duration = 200): Animated.CompositeAnimation => {
        return Animated.timing(object, {
            toValue,
            duration,
            useNativeDriver: true,
        });
    };

    const onFocus = () => {
        Animated.parallel([
            timing(translateBgAnim, 0),
            timing(opacityAnim[0], 1, 800),
            timing(opacityAnim[1], 1, 800),
            timing(opacityAnim[2], 1, 800),
            timing(translateTextAnim[0], 0),
            timing(translateTextAnim[1], 0),
            timing(translateTextAnim[2], 0),
        ]).start();
    };

    const onBlur = () => {
        Animated.parallel([
            timing(translateBgAnim, TRANSLATE_VAL_HIDDEN),
            timing(opacityAnim[0], 0, 100),
            timing(opacityAnim[1], 0, 100),
            timing(opacityAnim[2], 0, 100),
            timing(translateTextAnim[0], TRANSLATE_VAL_HIDDEN),
            timing(translateTextAnim[1], TRANSLATE_VAL_HIDDEN),
            timing(translateTextAnim[2], TRANSLATE_VAL_HIDDEN),
        ]).start();
    };

    return (
        <Screen style={theme.styles.menuContainer} onFocus={onFocus} onBlur={onBlur} stealFocus={false}>
            <Animated.View
                style={[theme.styles.sideMenuContainerAnimation, { transform: [{ translateX: translateBgAnim }] }]}
            />
            <TouchableOpacity
                onPress={() => navigate(ROUTES.HOME)}
                style={theme.styles.menuButton}
                focusOptions={{
                    forbiddenFocusDirections: ['up'],
                }}
                {...testProps('template-menu-home-button')}
            >
                <Icon
                    name="md-home"
                    size={theme.static.iconSize}
                    color={theme.static.colorBrand}
                    {...testProps('template-menu-home-icon')}
                />
                <AnimatedText
                    style={[
                        theme.styles.buttonText,
                        theme.styles.menuButtonText,
                        {
                            transform: [{ translateX: translateTextAnim[0] }],
                            opacity: opacityAnim[0],
                        },
                    ]}
                >
                    Home
                </AnimatedText>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigate(ROUTES.CAROUSELS)}
                style={theme.styles.menuButton}
                {...testProps('template-menu-carousels-button')}
            >
                <Icon
                    name="md-rocket"
                    size={theme.static.iconSize}
                    color={theme.static.colorBrand}
                    {...testProps('template-menu-carousels-icon')}
                />
                <AnimatedText
                    style={[
                        theme.styles.buttonText,
                        theme.styles.menuButtonText,
                        {
                            transform: [{ translateX: translateTextAnim[1] }],
                            opacity: opacityAnim[1],
                        },
                    ]}
                >
                    Carousels
                </AnimatedText>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigate(ROUTES.MODAL)}
                style={theme.styles.menuButton}
                focusOptions={{
                    forbiddenFocusDirections: ['down'],
                }}
                {...testProps('template-menu-my-modal-button')}
            >
                <Icon
                    name="ios-albums"
                    size={theme.static.iconSize}
                    color={theme.static.colorBrand}
                    {...testProps('template-menu-my-modal-icon')}
                />
                <AnimatedText
                    style={[
                        theme.styles.buttonText,
                        theme.styles.menuButtonText,
                        {
                            transform: [{ translateX: translateTextAnim[2] }],
                            opacity: opacityAnim[2],
                        },
                    ]}
                >
                    My Modal
                </AnimatedText>
            </TouchableOpacity>
        </Screen>
    );
};

export default Menu;

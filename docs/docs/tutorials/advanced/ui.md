---
sidebar_position: 5
---

# UI

In this section we will cover the styling of the application and we will also add a custom menu component, which will improve the user experience.

## Styles

Styling for the applications is done in React Native like fashion, meaning camel case is used and not all browser specific css features are supported. More on the key differences in [React Native documentation](https://reactnative.dev/docs/style). We also are using `react-native-media-query` library to have responsive styles on web, you can read more on that [here](https://github.com/kasinskas/react-native-media-query).

Lets define our styles in the single file - `./src/config.tsx`, just above the ThemeContext definition as they are dependant on the changes in theme.

> This is only meant as an example. If you plan to scale your application, it's recommended to have separate styles file for each component or screen as the list of styles can become huge and cumbersome to maintain.

```typescript
import React, { createContext, useState } from 'react';
import { Dimensions, PixelRatio, StatusBarStyle } from 'react-native';
import StyleSheet from 'react-native-media-query';
import {
    getScaledValue,
    isEngineNative,
    isEngineRnWeb,
    isFactorBrowser,
    isFactorDesktop,
    isFactorMobile,
    isFactorTv,
    isPlatformAndroidtv,
    isPlatformFiretv,
    isPlatformTizen,
    isPlatformWeb,
    isPlatformWebos,
    isPlatformWindows,
    isPlatformMacos,
    registerServiceWorker,
} from '@rnv/renative';
import '../platformAssets/runtime/fontManager';
import { StaticTheme, Theme } from './configTypes';
//@ts-ignore
import ICON_LOGO from '../platformAssets/runtime/logo.png';

if (isFactorBrowser) registerServiceWorker();

export const hasMobileWebUI = isFactorMobile && isEngineWeb;
export const hasHorizontalMenu = !isFactorMobile && !isFactorDesktop && !hasMobileWebUI;
export const isWebBased = isPlatformWeb || isPlatformTizen || isPlatformWebos;

const staticTheme = {
    primaryFontFamily: 'Inter-Light',
    iconSize: getScaledValue(30),
    buttonSize: getScaledValue(30),
    menuWidth: hasHorizontalMenu ? '100%' : getScaledValue(280),
    menuHeight: hasHorizontalMenu ? getScaledValue(80) : '100%',
    colorBrand: '#0A74E6',
};

const staticThemes = {
    dark: {
        colorBgPrimary: '#000000',
        colorTextPrimary: '#FFFFFF',
        colorTextSecondary: '#AAAAAA',
        colorBorder: '#111111',
        statusBar: 'light-content' as StatusBarStyle,
        ...staticTheme,
    },
    light: {
        colorBgPrimary: '#FFFFFF',
        colorTextPrimary: '#000000',
        colorTextSecondary: '#333333',
        colorBorder: '#EEEEEE',
        statusBar: 'dark-content' as StatusBarStyle,
        ...staticTheme,
    },
};

export function Ratio(pixels: number): number {
    if (!(isPlatformAndroidtv || isPlatformFiretv)) return pixels;
    const resolution = Dimensions.get('screen').height * PixelRatio.get();

    return Math.round(pixels / (resolution < 2160 ? 2 : 1));
}

export const createStyleSheet = (currentTheme: StaticTheme) =>
    StyleSheet.create({
        app: {
            flexDirection: isFactorDesktop ? 'row' : 'column',
        },
        appContainer: {
            position: 'absolute',
            left: !hasHorizontalMenu ? getScaledValue(280) : 0,
            right: 0,
            top: hasHorizontalMenu ? getScaledValue(80) : 0,
            bottom: 0,
        },
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: getScaledValue(50),
            minHeight: getScaledValue(300),
            alignSelf: 'stretch',
            width: '100%',
        },
        modalContainer: isEngineWeb
            ? {
                  position: 'absolute',
                  backgroundColor: currentTheme.colorBgPrimary,
                  zIndex: 100,
                  top: 0,
                  left: 0,
                  height: '100vh',
                  width: '100%',
              }
            : {
                  flex: 1,
                  backgroundColor: currentTheme.colorBgPrimary,
              },
        textH1: {
            fontFamily: currentTheme.primaryFontFamily,
            fontSize: getScaledValue(28),
            marginHorizontal: getScaledValue(20),
            color: currentTheme.colorTextPrimary,
            textAlign: 'center',
            fontWeight: '600',
        },
        textH2: {
            fontFamily: currentTheme.primaryFontFamily,
            fontSize: getScaledValue(20),
            marginHorizontal: getScaledValue(20),
            color: currentTheme.colorTextPrimary,
            textAlign: 'center',
        },
        textH3: {
            fontFamily: currentTheme.primaryFontFamily,
            fontSize: getScaledValue(15),
            marginHorizontal: getScaledValue(20),
            marginTop: getScaledValue(5),
            color: currentTheme.colorTextPrimary,
            textAlign: 'center',
        },
        text: {
            fontFamily: currentTheme.primaryFontFamily,
            color: currentTheme.colorTextSecondary,
            fontSize: getScaledValue(20),
            marginTop: getScaledValue(10),
            textAlign: 'left',
        },
        icon: {
            width: getScaledValue(40),
            height: getScaledValue(40),
            margin: getScaledValue(10),
        },
        button: {
            marginHorizontal: getScaledValue(20),
            borderWidth: getScaledValue(2),
            borderRadius: getScaledValue(25),
            borderColor: currentTheme.colorBorder,
            height: getScaledValue(50),
            width: '80%',
            marginTop: getScaledValue(20),
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonText: {
            fontFamily: currentTheme.primaryFontFamily,
            color: currentTheme.colorTextPrimary,
            fontSize: getScaledValue(20),
        },
        screen: {
            backgroundColor: currentTheme.colorBgPrimary,
            flex: 1,
        },
        screenModal: {
            position: 'absolute',
            backgroundColor: currentTheme.colorBgPrimary,
            top: hasHorizontalMenu && isEngineWeb ? -currentTheme.menuHeight : 0,
            left: hasHorizontalMenu || isEngineNative || isPlatformMacos ? 0 : -currentTheme.menuWidth,
            right: 0,
            bottom: 0,
            zIndex: 3,
        },
        headerTitle: {
            color: currentTheme.colorTextSecondary,
            fontFamily: currentTheme.primaryFontFamily,
            fontSize: getScaledValue(18),
        },
        header: {
            backgroundColor: currentTheme.colorBgPrimary,
            borderBottomWidth: 1,
            height: getScaledValue(70),
        },
        modalHeader: {
            width: '100%',
            height: getScaledValue(80),
            alignItems: 'flex-end',
            paddingTop: getScaledValue(20),
        },
        image: {
            marginBottom: getScaledValue(30),
            width: getScaledValue(100),
            height: getScaledValue(100),
        },
        menuContainer: {
            ...(isFactorTv
                ? {
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                  }
                : {
                      paddingTop: getScaledValue(hasHorizontalMenu ? 20 : 40),
                      backgroundColor: currentTheme.colorBgPrimary,
                      alignItems: 'flex-start',
                      borderBottomWidth: getScaledValue(hasHorizontalMenu ? 1 : 0),
                      borderColor: currentTheme.colorBorder,
                      flexDirection: hasHorizontalMenu ? 'row' : 'column',
                      borderRightWidth: getScaledValue(hasHorizontalMenu ? 0 : 1),
                      width: isPlatformMacos ? currentTheme.menuWidth : '100%',
                      height: currentTheme.menuHeight,
                  }),
        },
        menuContainerBurgerOpen: {
            height: '100vh',
            width: isPlatformWindows ? '100%' : '100%',
            zIndex: 5,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flex: 1,
        },
        burgerMenuBtn: {
            flex: 1,
            display: 'none',
            textAlign: 'end',
            right: 10,
            '@media (max-width: 768px)': {
                display: 'flex !important;',
            },
        },
        menuItems: {
            display: 'flex',
            flexDirection: 'row',
            '@media (max-width: 768px)': {
                display: 'none',
            },
        },
        menuItemsBurgerOpen: {
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            top: 50,
        },
        sideMenuContainerAnimation: {
            backgroundColor: currentTheme.colorBgPrimary,
            width: Ratio(400),
            borderColor: currentTheme.colorBorder,
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            borderWidth: 1,
        },
        menuButton: {
            alignSelf: 'flex-start',
            alignItems: 'center',
            maxWidth: getScaledValue(400),
            minWidth: getScaledValue(50),
            flexDirection: 'row',
            padding: getScaledValue(10),
            ...(isFactorTv && {
                marginRight: Ratio(20),
            }),
        },
        menuButtonText: {
            marginLeft: isFactorTv ? Ratio(16) : 8,
        },
        recyclerContainer: {
            flex: 1,
            ...(isFactorTv && {
                left: Ratio(80),
                marginVertical: Ratio(20),
            }),
        },
        recyclerContent: {
            ...(isFactorTv && {
                paddingLeft: Ratio(40),
                paddingRight: Ratio(100),
            }),
        },
        recycler: { width: '100%', height: Ratio(270) },
        recyclerItem: {
            width: getScaledValue(90),
            height: getScaledValue(50),
            margin: getScaledValue(5),
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        recyclerItemText: {
            color: currentTheme.colorTextPrimary,
            fontSize: isFactorMobile ? 12 : Ratio(28),
        },
        center: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        detailsInfoContainer: {
            backgroundColor: 'rgba(0,0,0,0.2)',
            width: isFactorTv ? '50%' : '90%',
            padding: Ratio(30),
        },
        detailsTitle: {
            fontSize: isFactorMobile ? 22 : Ratio(42),
            color: '#FFFFFF',
            marginBottom: Ratio(20),
            textAlign: 'center',
        },
    });

export const ROUTES = {
    HOME: isWebBased ? '/' : 'home',
    MODAL: 'modal',
    CAROUSELS: 'carousels',
    DETAILS: 'details',
};

const lightStyleSheet = createStyleSheet(staticThemes.light);
const darkStyleSheet = createStyleSheet(staticThemes.dark);

const themes = {
    light: {
        static: { ...staticThemes.light },
        styles: lightStyleSheet.styles,
        ids: lightStyleSheet.ids,
    },
    dark: {
        static: { ...staticThemes.dark },
        styles: darkStyleSheet.styles,
        ids: darkStyleSheet.ids,
    },
};

type ThemeContextType = {
    theme: Theme;
    dark: boolean;
    toggle?: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({ theme: themes.dark, dark: true });

export function ThemeProvider({ children }) {
    const [dark, setDark] = useState<ThemeContextType['dark']>(false);

    const toggle = () => {
        const isDark = !dark;
        setDark(isDark);
    };

    const theme = dark ? themes.dark : themes.light;

    return <ThemeContext.Provider value={{ theme, dark, toggle }}>{children}</ThemeContext.Provider>;
}

export const themeStyles = themes.dark.styles;

export { ICON_LOGO };

export default staticThemes.dark;
```

## `Menu` component

On web and mobile our menu needs to be just a View, which wraps all the menu items, because we can utilize the default animation for drawer on mobile and on web we render the menu without any animation at all. Create `components/menu.tsx` file and paste the code below into it.

```typescript
import React, { useContext, useState } from 'react';
import { View, TouchableOpacity, Text } from '@flexn/create';
import { testProps } from '../utils';
import { isFactorBrowser } from '@rnv/renative';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext, ROUTES } from '../config';
import { useNavigate } from '../hooks';

export const DrawerButton = ({ navigation }: { navigation?: any }) => {
    const { theme } = useContext(ThemeContext);
    return (
        <TouchableOpacity
            onPress={() => {
                if (navigation && navigation.dispatch) navigation.dispatch({ type: 'OPEN_DRAWER' });
            }}
            {...testProps('template-menu-open-drawer-button')}
        >
            <Icon name="menu" color={theme.static.colorTextPrimary} size={theme.static.buttonSize} />
        </TouchableOpacity>
    );
};

const Menu = ({ navigation }: { navigation?: any }) => {
    const navigate = useNavigate({ navigation });
    const { theme } = useContext(ThemeContext);
    const [burgerMenuOpen, setBurgerMenuOpen] = useState<boolean>(false);

    const onPress = (route: string) => {
        navigate(route);
        setBurgerMenuOpen(false);
    };

    const renderMenuItems = () => (
        <>
            <TouchableOpacity
                onPress={() => onPress(ROUTES.HOME)}
                style={theme.styles.menuButton}
                {...testProps('template-menu-home-button')}
            >
                <Icon
                    name="md-home"
                    size={theme.static.iconSize}
                    color={theme.static.colorBrand}
                    {...testProps('template-menu-home-icon')}
                />
                <Text style={[theme.styles.buttonText, theme.styles.menuButtonText]}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onPress(ROUTES.CAROUSELS)}
                style={theme.styles.menuButton}
                {...testProps('template-menu-my-page-button')}
            >
                <Icon
                    name="md-rocket"
                    size={theme.static.iconSize}
                    color={theme.static.colorBrand}
                    {...testProps('template-menu-my-page-rocket-icon')}
                />
                <Text style={[theme.styles.buttonText, theme.styles.menuButtonText]}>Carousels</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onPress(ROUTES.MODAL)}
                style={theme.styles.menuButton}
                {...testProps('template-menu-my-modal-button')}
            >
                <Icon
                    name="ios-albums"
                    size={theme.static.iconSize}
                    color={theme.static.colorBrand}
                    {...testProps('template-menu-my-modal-albums-icon')}
                />
                <Text style={[theme.styles.buttonText, theme.styles.menuButtonText]}>My Modal</Text>
            </TouchableOpacity>
        </>
    );

    const renderMenu = () => {
        if (isFactorBrowser) {
            return (
                <View
                    style={burgerMenuOpen ? theme.styles.menuItemsBurgerOpen : theme.styles.menuItems}
                    dataSet={{ media: burgerMenuOpen ? theme.ids.menuItemsBurgerOpen : theme.ids.menuItems }}
                >
                    {renderMenuItems()}
                </View>
            );
        }

        return renderMenuItems();
    };

    const renderBurgerButton = () => {
        if (isFactorBrowser) {
            return (
                <TouchableOpacity
                    style={[theme.styles.burgerMenuBtn, burgerMenuOpen && { display: 'flex' }]}
                    dataSet={{ media: theme.ids.burgerMenuBtn }}
                    onPress={() => setBurgerMenuOpen(!burgerMenuOpen)}
                >
                    <Icon
                        name={burgerMenuOpen ? 'md-close' : 'md-menu'}
                        size={theme.static.iconSize}
                        color={theme.static.colorBrand}
                        {...testProps('template-menu-home-icon')}
                    />
                </TouchableOpacity>
            );
        }

        return null;
    };

    return (
        <View
            style={[theme.styles.menuContainer, burgerMenuOpen && theme.styles.menuContainerBurgerOpen]}
            dataSet={{ media: `${theme.ids.menuContainer} ${burgerMenuOpen && theme.styles.menuContainerBurgerOpen}` }}
        >
            {renderBurgerButton()}
            {renderMenu()}
        </View>
    );
};

export default Menu;
```

We also make sure to render a burger button to open the drawer on mobile as this is usually the expected behavior for the end user.

However, default animations and layout from react navigation don't work that well when it comes to handling focus events, therefore on TV platforms we will need to customize the menu even further. Create a `components/menu.tv.native.tsx` file and paste the code below into it.

```typescript
import React, { useContext, useRef } from 'react';
import { Animated } from 'react-native';
import { TouchableOpacity, Text, Screen } from '@flexn/create';
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
                {...testProps('template-menu-my-page-button')}
            >
                <Icon
                    name="md-rocket"
                    size={theme.static.iconSize}
                    color={theme.static.colorBrand}
                    {...testProps('template-menu-my-page-rocket-icon')}
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
                    {...testProps('template-menu-my-modal-albums-icon')}
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
```

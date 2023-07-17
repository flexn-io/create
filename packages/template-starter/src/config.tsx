import React, { createContext, ReactNode, useState } from 'react';
import { Dimensions, PixelRatio, StatusBarStyle } from 'react-native';
import StyleSheet from 'react-native-media-query';
import {
    getScaledValue,
    isEngineRn,
    isEngineRnNext,
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
    isEngineRnMacos,
    isEngineRnWindows,
} from '@rnv/renative';
import '../platformAssets/runtime/fontManager';
import { StaticTheme, Theme } from './types';
import ICON_LOGO from '../platformAssets/runtime/logo.png';

export const hasMobileWebUI = isFactorMobile && isEngineRnNext;
export const hasHorizontalMenu = !isFactorMobile && !isFactorDesktop && !hasMobileWebUI;
export const isWebBased = isPlatformWeb || isPlatformTizen || isPlatformWebos;
const isEngineNative = isEngineRn || isEngineRnMacos || isEngineRnWindows;

export const LAYOUT = {
    w: 1920,
    h: 1080,
};

const staticTheme = {
    primaryFontFamily: 'Inter-Light',
    iconSize: getScaledValue(30),
    buttonSize: getScaledValue(30),
    menuWidth: hasHorizontalMenu ? '100%' : getScaledValue(200),
    menuHeight: hasHorizontalMenu ? getScaledValue(80) : '100%',
    colorBrand: '#0A74E6',
};

const staticThemes: any = {
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
        modalContainer: {
            ...(isEngineRnNext && {
                position: 'absolute',
                backgroundColor: currentTheme.colorBgPrimary,
                zIndex: 100,
                top: 0,
                left: 0,
                height: '100vh',
                width: '100%',
            }),
            ...(!isEngineRnNext && {
                flex: 1,
                backgroundColor: currentTheme.colorBgPrimary,
            }),
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
            justifyContent: 'center',
            alignItems: 'center',
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
            width: '100%',
            height: '100%',
        },
        screenModal: {
            position: 'absolute',
            backgroundColor: currentTheme.colorBgPrimary,
            top: hasHorizontalMenu && isEngineRnNext ? -currentTheme.menuHeight : 0,
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
            ...(isFactorTv && {
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
            }),
            ...(!isFactorTv && {
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
            ...(isFactorTv && {
                position: 'absolute',
                ...((isPlatformAndroidtv || isPlatformFiretv) && {
                    left: -50,
                }),
            }),
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

const themes: {
    dark: any;
    light: any;
} = {
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

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [dark, setDark] = useState<ThemeContextType['dark']>(false);

    const toggle = () => {
        const isDark = !dark;
        setDark(isDark);
    };

    const theme = dark ? themes.dark : themes.light;

    return <ThemeContext.Provider value={{ theme, dark, toggle }}>{children}</ThemeContext.Provider>;
}

export const themeStyles = themes.dark.styles;

export const THEME = staticThemes;

export const THEME_LIGHT = 'light';

export const THEME_DARK = 'dark';

export { ICON_LOGO };

export default staticThemes.dark;

export const getWidth = () => {
    return Dimensions.get('window').width * (isPlatformAndroidtv ? 2 : 1);
};

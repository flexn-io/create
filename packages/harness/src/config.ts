import {
    getScaledValue,
    isEngineRn,
    isEngineRnMacos,
    isEngineRnWeb,
    isEngineRnWindows,
    // isFactorBrowser,
    isFactorDesktop,
    isFactorMobile,
    // registerServiceWorker,
} from '@rnv/renative';
import '../platformAssets/runtime/fontManager';
import { StyleSheet } from '@flexn/create';

import Config from '../platformAssets/renative.runtime.json';
export { default as ICON_LOGO } from '../platformAssets/runtime/logo.png';

const CONFIG: any = Config;

export { CONFIG };

// if (isFactorBrowser) registerServiceWorker();

export const hasMobileWebUI = isFactorMobile && isEngineRnWeb;
export const hasHorizontalMenu = !isFactorMobile && !isFactorDesktop && !hasMobileWebUI;
export const hasFullScreenMenu = hasMobileWebUI;
export const hasVerticalMenu = !hasHorizontalMenu && !hasFullScreenMenu;

const isEngineNative = isEngineRn || isEngineRnMacos || isEngineRnWindows;

// Disable yellow warnings UI
console.disableYellowBox = true; // eslint-disable-line no-console

const theme = {
    color1: '#222222',
    color2: '#62DBFB',
    color3: '#FB8D62',
    color4: '#FFFFFF',
    color5: '#AAAAAA',
    primaryFontFamily: 'Inter-Light',
    iconSize: getScaledValue(40),
    menuWidth: hasHorizontalMenu || hasFullScreenMenu ? '100%' : getScaledValue(280),
    menuHeight: hasHorizontalMenu ? getScaledValue(80) : '100%',
    statusBar: 'light-content',
};

export const themeStyles = StyleSheet.create({
    app: {
        flexDirection: isFactorDesktop ? 'row' : 'column',
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
    },
    appContainer: {
        position: 'absolute',
        left: hasVerticalMenu ? getScaledValue(280) : 0,
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
    modalContainer: isEngineRnWeb
        ? {
            position: 'absolute',
            backgroundColor: theme.color1,
            zIndex: 100,
            top: 0,
            left: 0,
            height: '100vh',
            width: '100%',
        }
        : { flex: 1, backgroundColor: theme.color1 },
    textH2: {
        fontFamily: theme.primaryFontFamily,
        fontSize: getScaledValue(20),
        marginHorizontal: getScaledValue(20),
        color: theme.color4,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    textH3: {
        fontFamily: theme.primaryFontFamily,
        fontSize: getScaledValue(15),
        marginHorizontal: getScaledValue(20),
        marginTop: getScaledValue(5),
        color: theme.color2,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    text: {
        fontFamily: theme.primaryFontFamily,
        color: theme.color4,
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
        borderColor: theme.color2,
        height: getScaledValue(50),
        // minWidth: getScaledValue(350),
        // maxWidth: getScaledValue(500),
        width: '80%',
        marginTop: getScaledValue(20),
    },
    buttonText: {
        fontFamily: theme.primaryFontFamily,
        color: theme.color2,
        fontSize: getScaledValue(20),
    },
    screen: {
        position: 'absolute',
        backgroundColor: theme.color1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    screenModal: {
        position: 'absolute',
        backgroundColor: theme.color1,
        top: hasHorizontalMenu && isEngineRnWeb ? -theme.menuHeight : 0,
        left: hasHorizontalMenu || hasFullScreenMenu || isEngineNative ? 0 : -theme.menuWidth,
        right: 0,
        bottom: 0,
    },
    headerTitle: {
        color: theme.color3,
        fontFamily: theme.primaryFontFamily,
        fontSize: getScaledValue(18),
    },
    header: {
        backgroundColor: theme.color1,
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
});

export const ROUTES = {
    HOME: '/',
    MODAL: 'modal',
};

export default theme;

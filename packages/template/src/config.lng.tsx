export const ROUTES = {
    HOME: 'home',
    MODAL: 'modal',
    CAROUSELS: 'carousels',
    DETAILS: 'details',
};

export const LAYOUT = {
    w: 1920,
    h: 1080,
};

const staticTheme = {
    primaryFontFamily: 'Inter-Light',
    iconSize: 30,
    buttonSize: 30,
    menuWidth: 280,
    menuHeight: '100%',
    colorBrand: '#0A74E6',
};

const staticThemes = {
    dark: {
        colorBgPrimary: '#000000',
        colorTextPrimary: '#FFFFFF',
        colorTextSecondary: '#AAAAAA',
        colorBorder: '#111111',
        ...staticTheme,
    },
    light: {
        colorBgPrimary: '#FFFFFF',
        colorTextPrimary: '#000000',
        colorTextSecondary: '#333333',
        colorBorder: '#EEEEEE',
        ...staticTheme,
    },
};

export const THEME = staticThemes;

export function getHexColor(hex: string, alpha = 100) {
    if (!hex) {
        return 0x00;
    }

    if (hex.startsWith('#')) {
        hex = hex.substring(1);
    }
  
    const hexAlpha = Math.round((alpha / 100) * 255).toString(16);
    const str = `0x${hexAlpha}${hex}`;
    return parseInt(Number(str), 10);
}
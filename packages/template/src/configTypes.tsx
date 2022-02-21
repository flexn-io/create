import { ImageStyle, StatusBarStyle, TextStyle, ViewStyle } from 'react-native';

export type StaticTheme = {
    primaryFontFamily?: string;
    iconSize: number;
    buttonSize: number;
    menuWidth: number;
    menuHeight: number;
    colorLight?: string;
    colorBrand: string;
    colorBgPrimary: string;
    colorTextPrimary: string;
    colorTextSecondary: string;
    colorBorder: string;
    statusBar: StatusBarStyle;
};

export type ApplicationStyles = {
    app: ViewStyle;
    appContainer: ViewStyle;
    container: ViewStyle;
    modalContainer: ViewStyle;
    textH1: TextStyle;
    textH2: TextStyle;
    textH3: TextStyle;
    text: TextStyle;
    icon: ViewStyle;
    button: ViewStyle;
    buttonText: TextStyle;
    screen: ViewStyle;
    screenModal: ViewStyle;
    headerTitle: TextStyle;
    header: ViewStyle;
    modalHeader: ViewStyle;
    image: ImageStyle;
    menuContainer: ViewStyle;
    menuButton: ViewStyle;
    recycler: ViewStyle;
    recyclerItem: ViewStyle;
    sideMenuContainerAnimation: ViewStyle;
    menuButtonText: TextStyle;
    recyclerContent: ViewStyle;
    recyclerContainer: ViewStyle;
    burgerMenuBtn: ViewStyle;
    menuContainerBurgerOpen: ViewStyle;
    menuItemsBurgerOpen: ViewStyle;
    detailsInfoContainer: ViewStyle;
    menuItems: ViewStyle;
    center: ViewStyle;
    detailsTitle: TextStyle;
    recyclerItemText: TextStyle;
};

export type RNMQIDS = {
    menuContainer: string;
    burgerMenuBtn: string;
    menuContainerBurgerOpen: string;
    menuItemsBurgerOpen: string;
    menuItems: string;
};

export type Theme = {
    static: StaticTheme;
    styles: ApplicationStyles;
    ids: RNMQIDS;
};

declare module '@rnv/engine-rn-tvos';
declare module 'react-native-carplay';
declare module 'renative' {
    import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
    type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

    type IconProps = {
        iconFont:
            | 'fontAwesome'
            | 'feather'
            | 'antDesign'
            | 'entypo'
            | 'evilIcons'
            | 'foundation'
            | 'ionicons'
            | 'materialIcons'
            | 'octicons'
            | 'simpleLineIcons'
            | 'zocial';
        iconName: string;
        iconColor: string;
        onPress?: () => void;
        style?: ViewStyle;
        className?: string;
        testID?: string;
        size: number;
    };

    const StyleSheet: { create<T extends NamedStyles<T> | NamedStyles<any>>(styles: T | NamedStyles<T>): T };

    const isFactorMobile: boolean;
    const isPlatformWeb: boolean;
    const isPlatformIos: boolean;
    const isPlatformAndroid: boolean;
    const isFactorTv: string;
    const isPlatformTvos: boolean;
    const isPlatformAndroidtv: boolean;
    const isPlatformFiretv: boolean;
    const isFactorNative: boolean;
    const isFactorDesktop: boolean;
    const isEngineNative: boolean;
    const isEngineRnElectron: boolean;
    const isEngineWeb: boolean;
    const isFactorBrowser: boolean;
    const isWebBased: boolean;
    const isPlatformMacos: boolean;
    const isPlatformWindows: boolean;
    const registerServiceWorker: () => void;
    const Api: { platform: string; formFactor: string; engine: string };
    function getScaledValue(value: number): number;
    function Icon(props: IconProps): JSX.Element;
    function useNavigate(props): (route: any, opts?: any, idk?: any, params?: any) => void;

    export {
        isFactorMobile,
        isPlatformWeb,
        isPlatformIos,
        isPlatformAndroid,
        isFactorTv,
        isPlatformTvos,
        isPlatformAndroidtv,
        isPlatformFiretv,
        isPlatformMacos,
        isPlatformWindows,
        isFactorNative,
        isFactorDesktop,
        isEngineNative,
        isEngineWeb,
        isEngineRnElectron,
        isFactorBrowser,
        isWebBased,
        registerServiceWorker,
        getScaledValue,
        IconProps,
        Icon,
        useNavigate,
        StyleSheet,
        Api,
    };
}
// export {};
declare global {
    namespace NodeJS {
        interface Global {
            HermesInternal: any;
        }
    }
}

declare module '*.png' {
    const value: any;
    export default value;
}

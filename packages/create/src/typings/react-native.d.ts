declare module 'react-native' {
    import 'react-native';
    class TVEventHandler {
        enable: any;
    }
    class ViewProps {
        animatorOptions?: any;
        focusContext?: any;
        focusOptions?: any;
        className?: any;
    }
    class TouchableOpacityProps {
        focusContext?: any;
        focusOptions?: any;
        className?: any;
    }
    class PressableProps {
        focusContext?: any;
        focusOptions?: any;
        className?: any;
    }
    class ScrollViewProps {
        focusContext?: any;
        focusOptions?: any;
    }
    interface UIManagerStatic {
        dispatchViewManagerCommand: (
            reactTag: number | null,
            commandID: number | string,
            commandArgs?: Array<any>
        ) => void;
    }

    export const TVMenuControl: {
        enableTVMenuKey(): void;
        disableTVMenuKey(): void;
    };
}
export default {};

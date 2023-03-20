import 'react-native';

declare module 'react-native' {
    class TVEventHandler {
        enable: any;
    }
    class ViewProps {
        animatorOptions?: any;
        focusContext?: any;
        className?: any;
    }
    class TouchableOpacityProps {
        focusContext?: any;
        className?: any;
    }
    class PressableProps {
        focusContext?: any;
        className?: any;
    }
    class ScrollViewProps {
        focusContext?: any;
    }
    interface UIManagerStatic {
        dispatchViewManagerCommand: (
            reactTag: number | null,
            commandID: number | string,
            commandArgs?: Array<any>
        ) => void;
    }
}

// Primitive components
export { default as ActivityIndicator } from './components/ActivityIndicator';
export { default as App } from './components/App';
export { default as Debugger } from './components/Debugger';
export { default as FlatList } from './components/FlatList';
export { default as Image } from './components/Image';
export { default as Pressable } from './components/Pressable';
export { default as TouchableOpacity } from './components/TouchableOpacity';
export { default as Icon } from './components/Icon';
export { default as Screen } from './components/Screen';
export { default as ScrollView } from './components/ScrollView';
export { default as Switch } from './components/Switch';
export { default as Text } from './components/Text';
export { default as TextInput } from './components/TextInput';
export { default as View } from './components/View';
export { default as ImageBackground } from './components/ImageBackground';
export { default as Modal } from './components/Modal';

// APIs
export { default as StyleSheet } from './apis/StyleSheet';
export { default as Animated } from './apis/Animated';
export { default as Appearance } from './apis/Appearance';
export { ScreenProps, ScreenStates } from './focusManager/types';

export * from './rootRenderer';

export const ANIMATION_TYPES = {
    BORDER: 'border',
    SCALE: 'scale',
    SCALE_BORDER: 'scale_with_border',
    BACKGROUND: 'background',
};

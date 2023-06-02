// Functions
import CoreManager from './focusManager/service/core';

export * from './rootRenderer';
export * from './tvMenuControl';

export { CoreManager };

export function focusElementByFocusKey(focusKey: string) {
    CoreManager.focusElementByFocusKey(focusKey);
}

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
export { default as FlashList } from './components/FlashList';

// APIs
export { default as StyleSheet } from './apis/StyleSheet';
export { default as Animated } from './apis/Animated';
export { default as Appearance } from './apis/Appearance';
export {
    ScreenProps,
    ScreenStates,
    FocusContext,
    CreateListRenderItem,
    CreateListRenderItemInfo,
} from './focusManager/types';

// Constants
export { ANIMATION_TYPES } from './focusManager/constants';

// Hooks & Hocs
export { withParentContextMapper } from './hocs/withParentContextMapper';
export { useTVRemoteHandler, TVRemoteHandler } from './remoteHandler';

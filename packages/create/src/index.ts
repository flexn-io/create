// Functions
import CoreManager from './focusManager/service/core';

export * from './rootRenderer';
export * from './tvMenuControl';

export { CoreManager };

// @deprecated
export function focusElementByFocusKey(focusKey: string) {
    CoreManager.setFocus(focusKey);
}

export function setFocus(focusKey: string) {
    CoreManager.setFocus(focusKey);
}

export function setFocusManagerEnabled(isEnabled: boolean) {
    CoreManager.setFocusManagerEnabled(isEnabled);
}

// Primitive components
export { default as ActivityIndicator } from './components/ActivityIndicator';
export { default as App } from './components/App';
export { default as Debugger } from './components/Debugger';
export { default as FlatList } from './components/FlatList';
export { default as Image } from './components/Image';
export { default as Pressable } from './components/Pressable';
export { default as TouchableOpacity } from './components/TouchableOpacity';
export { default as Screen } from './components/Screen';
export { default as ScrollView } from './components/ScrollView';
export { default as Switch } from './components/Switch';
export { default as Text } from './components/Text';
export { default as TextInput } from './components/TextInput';
export { default as View } from './components/View';
export { default as ViewGroup } from './components/ViewGroup';
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
    AnimatorBackground,
    AnimatorBorder,
    AnimatorScale,
    AnimatorScaleWithBorder,
} from './focusManager/types';

// Constants
export { ANIMATION_TYPES } from './focusManager/model/view';

// Hooks & Hocs
export { withParentContextMapper } from './hocs/withParentContextMapper';
export {
    useTVRemoteHandler,
    TVRemoteHandler,
    RemoteHandlerCallback,
    ClassRemoteHandlerCallback,
} from './remoteHandler';

import type {
    GestureResponderEvent,
    ScrollViewProps as RNScrollViewProps,
    StyleProp,
    ViewProps as RNViewProps,
    PressableProps as RNPressableProps,
    ViewStyle,
    ScrollView,
} from 'react-native';
import type { FlashListProps as FLProps, ListRenderItemInfo } from '@shopify/flash-list';
import FocusModel from './model/FocusModel';
import View from './model/view';

export type ClosestNodeOutput = {
    match1: number;
    match1Model?: View;
    match2: number;
    match2Model?: View;
    match3: number;
    match3Model?: View;
};

export type ForbiddenFocusDirections =
    | 'down'
    | 'up'
    | 'left'
    | 'right'
    | 'swipeDown'
    | 'swipeUp'
    | 'swipeLeft'
    | 'swipeRight';

export type WindowAlignment = 'both-edge' | 'low-edge';
export type ScreenStates = 'background' | 'foreground';

const ALIGNMENT_LOW_EDGE = 'low-edge';

export type PressableFocusOptions = {
    forbiddenFocusDirections?: ForbiddenFocusDirections[];
    animatorOptions?: any;
    focusKey?: string;
    hasInitialFocus?: boolean;
    nextFocusLeft?: string | string[];
    nextFocusRight?: string | string[];
    nextFocusUp?: string | string[];
    nextFocusDown?: string | string[];
};

export type ScreenFocusOptions = {
    forbiddenFocusDirections?: ForbiddenFocusDirections[];
    focusKey?: string;
    verticalWindowAlignment?: typeof ALIGNMENT_LOW_EDGE;
    horizontalWindowAlignment?: typeof ALIGNMENT_LOW_EDGE;
    horizontalViewportOffset?: number;
    verticalViewportOffset?: number;
    nextFocusLeft?: string | string[];
    nextFocusRight?: string | string[];
    nextFocusUp?: string | string[];
    nextFocusDown?: string | string[];
};

export type RecyclableListFocusOptions = {
    forbiddenFocusDirections?: ForbiddenFocusDirections[];
    nextFocusLeft?: string | string[];
    nextFocusRight?: string | string[];
    nextFocusUp?: string | string[];
    nextFocusDown?: string | string[];
};

export interface ViewProps extends RNViewProps {
    focus?: boolean;
    focusOptions?: PressableFocusOptions;
    focusContext?: any;
    focusRepeatContext?: any;
    onPress?: (e: GestureResponderEvent | any) => void;
    onBlur?: (response?: any) => void;
    onFocus?: any;
    children?: React.ReactNode;
    ref?: any;
    activeOpacity?: any;
    style?: StyleProp<ViewStyle>;
    animatorOptions?: any;
    className?: string;
    dataSet?: any;
}

export interface PressableProps extends RNPressableProps {
    focus?: boolean;
    focusOptions?: PressableFocusOptions;
    focusContext?: FocusModel;
    focusRepeatContext?: any;
    onPress?: (e: GestureResponderEvent | any) => void;
    onBlur?: (response?: any) => void;
    onFocus?: any;
    children: React.ReactNode;
    ref?: any;
    activeOpacity?: any;
    className?: string;
    animatorOptions?: any;
}

export interface ScrollViewProps extends RNScrollViewProps {
    focusContext?: any;
    horizontal?: boolean;
    children?: React.ReactNode;
    ref?: React.MutableRefObject<ScrollView>;
    focusOptions?: RecyclableListFocusOptions;
}

export interface ScreenProps {
    screenState?: ScreenStates;
    screenOrder?: number;
    stealFocus?: boolean;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    onBlur?: () => void;
    onFocus?: () => void;
    group?: string;
    focusOptions?: ScreenFocusOptions;
}

export type CreateListRenderItemInfo<Item> = {
    focusRepeatContext?: {
        focusContext: any;
        index: number;
    };
} & ListRenderItemInfo<Item>;

export type CreateListRenderItem<Item> = (info: CreateListRenderItemInfo<Item>) => React.ReactElement | null;

export interface FlashListProps<Item> extends FLProps<Item> {
    focusContext?: FocusModel;
    focusRepeatContext?: CreateListRenderItemInfo<Item>;
    isHorizontal?: boolean;
    scrollViewProps?: any;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    focusOptions?: RecyclableListFocusOptions;
    initialRenderIndex?: number;
    renderItem: CreateListRenderItem<Item>;
    type: 'list' | 'grid' | 'row';
    onBlur?: () => void;
    onFocus?: () => void;
}

export type FocusContext = FocusModel;

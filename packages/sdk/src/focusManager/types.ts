import type {
    GestureResponderEvent,
    ScrollViewProps as RNScrollViewProps,
    StyleProp,
    ViewProps as RNViewProps,
    PressableProps as RNPressableProps,
    ViewStyle,
    ScrollView,
} from 'react-native';
import AbstractModel from './model/AbstractFocusModel';
import ViewModel from './model/view';
import RecyclerModel from './model/recycler';
import ScreenModel from './model/screen';

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
    verticalWindowAlignment?: WindowAlignment;
    horizontalWindowAlignment?: WindowAlignment;
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
    parentContext?: any;
    repeatContext?: any;
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
    parentContext?: any;
    repeatContext?: any;
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
    parentContext?: any;
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
    focusOptions?: ScreenFocusOptions;
}

export interface RecyclerViewProps {
    parentContext?: any;
    repeatContext?: any;
    isHorizontal?: boolean;
    children?: React.ReactNode;
    dataProvider: any;
    layoutProvider: any;
    rowRenderer: any;
    bounces?: boolean;
    scrollViewProps?: any;
    scrollEventThrottle?: number;
    contentContainerStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    unmeasurableRelativeDimensions: { x?: number; y?: number };
    focusOptions?: RecyclableListFocusOptions;
    disableItemContainer?: boolean;
    initialRenderIndex?: number;
    type: 'list' | 'grid' | 'row';
    onBlur?: () => void;
    onFocus?: () => void;
}

//@deprecated
export interface Context {
    id: string;
    type: string;

    children: Context[];

    parent?: Context;

    layout?: any;
    prevState?: string;

    screen?: Context;

    data?: any;
    onFocus?(): void;
    onBlur?(): void;
    isScrollable?: boolean;
    nodeId?: any;
    node?: any;
    isFocused?: boolean;
    isHorizontal?: boolean;
    stealFocus?: boolean;
    verticalWindowAlignment?: string;
    horizontalWindowAlignment?: string;
    horizontalViewportOffset?: number;
    verticalViewportOffset?: number;
    isNested?: boolean;
    order?: number;
    scrollOffsetX?: number;
    scrollOffsetY?: number;
    isLastVisible?(): boolean;
    isFirstVisible?(): boolean;
    isRecyclable?: boolean;
    isFocusable?: boolean;
    focusKey?: string;
    state?: string; // proper type

    initialFocus?: Context;
    firstFocusable?: Context;
    lastFocused?: Context;
    repeatContext?: Context;
    parentContext?: Context;

    layouts?: any;
    index?: number;
    forbiddenFocusDirections?: string[];
    nextFocusLeft?: string | string[];
    nextFocusRight?: string | string[];
    nextFocusUp?: string | string[];
    nextFocusDown?: string | string[];
}

export type FocusMap = { [key: string]: AbstractModel };
export type View = ViewModel;
export type Recycler = RecyclerModel;
export type Screen = ScreenModel;
export type AbstractFocusModel = AbstractModel;

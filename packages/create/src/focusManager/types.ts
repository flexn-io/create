import type {
    ScrollViewProps as RNScrollViewProps,
    StyleProp,
    ViewProps as RNViewProps,
    PressableProps as RNPressableProps,
    TouchableOpacityProps as RNTouchableOpacityProps,
    ViewStyle,
    ScrollView,
    ColorValue,
    View as RNView,
} from 'react-native';
import type { MouseEvent } from 'react';
import type {
    FlashListProps as FLProps,
    ListRenderItemInfo,
} from '@flexn/shopify-flash-list';

import FocusModel from './model/abstractFocusModel';
import View from './model/view';
import { SCREEN_STATES, VIEWPORT_ALIGNMENT } from './model/screen';
import Screen from './model/screen';
import { DIRECTIONS } from './constants';
import ViewGroup from './model/viewGroup';

export type FocusDirection = (typeof DIRECTIONS)[keyof typeof DIRECTIONS];
export type WindowAlignment = 'both-edge' | 'low-edge';
export type ScreenStates = 'background' | 'foreground';
export type FocusContext = FocusModel;
export type ScreenType = Screen;
export type ViewType = View;
export type ViewGroupType = ViewGroup;
type AnimatorTypeScale = 'scale';
type AnimatorTypeScaleWithBorder = 'scale_with_border';
type AnimatorTypeAnimatorBorder = 'border';
type AnimatorTypeAnimatorBackground = 'background';
export type Animator =
    | AnimatorScale
    | AnimatorBorder
    | AnimatorScaleWithBorder
    | AnimatorBackground;

export type ClosestNodeOutput = {
    match1: number;
    match1Model: View | null;
    match2: number;
    match2Model: View | null;
};
export type ForbiddenFocusDirections = 'down' | 'up' | 'left' | 'right';

export type AnimatorScale = {
    type: AnimatorTypeScale;
    focus: {
        scale?: number;
        duration?: number;
    };
};

export type AnimatorScaleWithBorder = {
    type: AnimatorTypeScaleWithBorder;
    focus: {
        scale?: number;
        duration?: number;
        borderWidth: number;
        borderColor: ColorValue;
        borderRadius?: number;
    };
};

export type AnimatorBorder = {
    type: AnimatorTypeAnimatorBorder;
    focus: {
        borderWidth: number;
        borderColor: string;
        borderRadius?: number;
        duration?: number;
    };
};

export type AnimatorBackground = {
    type: AnimatorTypeAnimatorBackground;
    focus: {
        backgroundColor: ColorValue;
        duration?: number;
    };
};

export type PressableFocusOptions = {
    forbiddenFocusDirections?: ForbiddenFocusDirections[];
    animator?: Animator;
    focusKey?: string;
    nextFocusLeft?: string | string[];
    nextFocusRight?: string | string[];
    nextFocusUp?: string | string[];
    nextFocusDown?: string | string[];
    hasPreferredFocus?: boolean;
    verticalViewportOffset?: number;
};

export type ScreenFocusOptions = {
    forbiddenFocusDirections?: ForbiddenFocusDirections[];
    focusKey?: string;
    verticalWindowAlignment?: (typeof VIEWPORT_ALIGNMENT)[keyof typeof VIEWPORT_ALIGNMENT];
    horizontalWindowAlignment?: (typeof VIEWPORT_ALIGNMENT)[keyof typeof VIEWPORT_ALIGNMENT];
    horizontalViewportOffset?: number;
    verticalViewportOffset?: number;
    nextFocusLeft?: string | string[];
    nextFocusRight?: string | string[];
    nextFocusUp?: string | string[];
    nextFocusDown?: string | string[];
    screenState?: (typeof SCREEN_STATES)[keyof typeof SCREEN_STATES];
    screenOrder?: number;
    ignoreInitialFocus?: boolean;
    autoFocusEnabled?: boolean;
    group?: string;
};

export type RecyclableListFocusOptions = {
    forbiddenFocusDirections?: ForbiddenFocusDirections[];
    nextFocusLeft?: string | string[];
    nextFocusRight?: string | string[];
    nextFocusUp?: string | string[];
    nextFocusDown?: string | string[];
    autoLayoutScaleAnimation?: boolean;
    autoLayoutSize?: number;
    listHeaderDimensions?: { width: number; height: number };
    verticalViewportOffset?: number;
    initialFocusIndex?: number;
};

type MouseEvents = {
    onMouseDown?: (e: MouseEvent) => void;
    onMouseEnter?: (e: MouseEvent) => void;
    onMouseLeave?: (e: MouseEvent) => void;
    onMouseMove?: (e: MouseEvent) => void;
    onMouseOver?: (e: MouseEvent) => void;
    onMouseOut?: (e: MouseEvent) => void;
    onMouseUp?: (e: MouseEvent) => void;
};

export interface ViewProps extends RNViewProps, MouseEvents {
    focusOptions?: {
        group?: string;
        focusKey?: string;
        nextFocusLeft?: string | string[];
        nextFocusRight?: string | string[];
        nextFocusUp?: string | string[];
        nextFocusDown?: string | string[];
        allowFocusOutsideGroup?: boolean;
        verticalViewportOffset?: number;
    };
    focusContext?: FocusModel;
    focusRepeatContext?: CreateListRenderItemInfo<any>['focusRepeatContext'];
    ref?: React.ForwardedRef<RNView> | React.MutableRefObject<RNView>;
}

export interface ViewGroupProps extends RNViewProps {
    focusOptions: {
        group: string;
        focusKey?: string;
        nextFocusLeft?: string | string[];
        nextFocusRight?: string | string[];
        nextFocusUp?: string | string[];
        nextFocusDown?: string | string[];
        allowFocusOutsideGroup?: boolean;
        verticalViewportOffset?: number;
    };
    focusContext?: FocusContext;
    ref?: React.ForwardedRef<RNView> | React.MutableRefObject<RNView>;
}

export interface PressableProps extends RNPressableProps, MouseEvents {
    focus?: boolean;
    focusOptions?: PressableFocusOptions;
    focusContext?: FocusContext;
    focusRepeatContext?: CreateListRenderItemInfo<any>['focusRepeatContext'];
    onBlur?: () => void;
    onPress?: () => void;
    onLongPress?: () => void;
    onFocus?: () => void;
    className?: string;
    style?: ViewProps['style'];
}

export interface TouchableOpacityProps extends RNTouchableOpacityProps {
    focusOptions?: PressableFocusOptions;
    focusContext?: FocusContext;
    focusRepeatContext?: CreateListRenderItemInfo<any>['focusRepeatContext'];
    onBlur?: () => void;
    onPress?: () => void;
    onFocus?: () => void;
    className?: string;
    dataSet?: any;
}

export interface ScrollViewProps extends RNScrollViewProps {
    ref?: React.MutableRefObject<ScrollView>;
    focusContext?: FocusContext;
    focusOptions?: RecyclableListFocusOptions;
}

export interface ScreenProps {
    children?: React.ReactNode | React.ReactNode[];
    style?: StyleProp<ViewStyle>;
    onBlur?: () => void;
    onFocus?: () => void;
    focusOptions?: ScreenFocusOptions;
}

export interface FlashListProps<Item> extends FLProps<Item> {
    focusContext?: FocusModel;
    horizontal?: boolean;
    scrollViewProps?: RNScrollViewProps;
    style?: StyleProp<ViewStyle>;
    focusOptions?: RecyclableListFocusOptions;
    initialRenderIndex?: number;
    renderItem: CreateListRenderItem<Item>;
    type: 'grid' | 'row';
    onBlur?: () => void;
    onFocus?: () => void;
}

export interface CellContainerProps extends ViewProps {
    index: number;
}

export type CreateListRenderItemInfo<Item> = {
    focusRepeatContext?: {
        focusContext: any;
        index: number;
    };
} & ListRenderItemInfo<Item>;

export type CreateListRenderItem<Item> = (
    info: CreateListRenderItemInfo<Item>
) => React.ReactElement | null;

export type Layout = {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    xCenter: number;
    yCenter: number;
    width: number;
    height: number;
    yOffset: number;
    xOffset: number;
    xMaxScroll: number;
    yMaxScroll: number;
    scrollContentHeight: number;
    absolute: {
        xMin: number;
        xMax: number;
        yMin: number;
        yMax: number;
        xCenter: number;
        yCenter: number;
    };
};

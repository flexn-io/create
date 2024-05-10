import { Animated } from 'react-native';
import FocusModel from '../../focusManager/model/abstractFocusModel';
import CoreManager from '../../focusManager/service/core';

type EndResult = { finished: boolean };
type EndCallback = (result: EndResult) => void;

const onAnimationEnds = (focusContext?: FocusModel) => {
    if (focusContext) {
        focusContext.remeasureChildrenLayouts(focusContext);
    }
};

const getPropsFromAnimatableValue = (
    value: Animated.Value | Animated.ValueXY
) => {
    // it's internal property not intended to be used outside, but now it's only why
    // to determine which component we're animating
    const focusContext =
        // @ts-ignore
        value._children?.[0]?._children?.[0]?._children?.[0]?._props
            ?.focusContext;

    if (!focusContext) {
        // it's internal property not intended to be used outside, but now it's only why
        // to determine which component we're animating
        const focusKey =
            // @ts-ignore
            value._children?.[0]?._children?.[0]?._children?.[0]?._props
                ?.focusOptions?.focusKey;

        if (focusKey) {
            const element = Object.values({
                ...CoreManager.getViews(),
                ...CoreManager.getScreens(),
                ...CoreManager.getViewGroups(),
            }).find(
                (model) =>
                    model.getFocusKey() === focusKey && model.isInForeground()
            );

            if (element) {
                return element;
            }
        }
    }
    return focusContext;
};

export const spring = (
    value: Animated.Value | Animated.ValueXY,
    config: Animated.SpringAnimationConfig
): Animated.CompositeAnimation => {
    return {
        start: (callback?: EndCallback) => {
            Animated.spring(value, config).start(({ finished }) => {
                callback?.({ finished });
                onAnimationEnds(getPropsFromAnimatableValue(value));
            });
        },
        stop: Animated.spring(value, config).stop,
        reset: Animated.spring(value, config).reset,
    };
};

export const decay = (
    value: Animated.Value | Animated.ValueXY,
    config: Animated.DecayAnimationConfig
): Animated.CompositeAnimation => {
    return {
        start: (callback?: EndCallback) => {
            Animated.decay(value, config).start(({ finished }) => {
                callback?.({ finished });
                onAnimationEnds(getPropsFromAnimatableValue(value));
            });
        },
        stop: Animated.decay(value, config).stop,
        reset: Animated.decay(value, config).reset,
    };
};

export const timing = (
    value: Animated.Value | Animated.ValueXY,
    config: Animated.TimingAnimationConfig
): Animated.CompositeAnimation => {
    return {
        start: (callback?: EndCallback) => {
            Animated.timing(value, config).start(({ finished }) => {
                callback?.({ finished });
                onAnimationEnds(getPropsFromAnimatableValue(value));
            });
        },
        stop: Animated.timing(value, config).stop,
        reset: Animated.timing(value, config).reset,
    };
};

export default {
    ...Animated,
    timing,
    decay,
    spring,
};

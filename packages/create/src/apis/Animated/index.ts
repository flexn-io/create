import { Animated } from 'react-native';
import FocusModel from '../../focusManager/model/abstractFocusModel';

type EndResult = { finished: boolean };
type EndCallback = (result: EndResult) => void;

const onAnimationEnds = (focusContext?: FocusModel) => {
    if (focusContext) {
        focusContext.remeasureChildrenLayouts(focusContext);
    }
};

const getPropsFromAnimatableValue = (value: Animated.Value | Animated.ValueXY) => {
    // @ts-ignore it's internal property not intended to be used outside, but now it's only why
    // to determine which component we're animating
    const focusContext = value._children?.[0]?._children?.[0]?._children?.[0]?._props?.focusContext;

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

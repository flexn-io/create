import { Animated } from 'react-native';
import { measureSync } from '../../focusManager/layoutManager';
import FocusModel from '../../focusManager/model/abstractFocusModel';
import CoreManager from '../../focusManager/service/core';

type EndResult = { finished: boolean };
type EndCallback = (result: EndResult) => void;

const onAnimationEnds = () => {
    Object.values(CoreManager.getViews()).forEach((model: FocusModel) => {
        if (model.isInForeground()) {
            measureSync({ model });
        }
    });
};

export const loop = (
    animation: Animated.CompositeAnimation,
    config: Animated.LoopAnimationConfig
): Animated.CompositeAnimation => {
    return {
        start: (callback?: EndCallback) => {
            Animated.loop(animation, config).start(({ finished }) => {
                callback?.({ finished });
                onAnimationEnds();
            });
        },
        stop: Animated.loop(animation, config).stop,
        reset: Animated.loop(animation, config).reset,
    };
};

export const stagger = (time: number, animations: Array<Animated.CompositeAnimation>): Animated.CompositeAnimation => {
    return {
        start: (callback?: EndCallback) => {
            Animated.stagger(time, animations).start(({ finished }) => {
                callback?.({ finished });
                onAnimationEnds();
            });
        },
        stop: Animated.stagger(time, animations).stop,
        reset: Animated.stagger(time, animations).reset,
    };
};

export const parallel = (
    animations: Array<Animated.CompositeAnimation>,
    config: Animated.ParallelConfig
): Animated.CompositeAnimation => {
    return {
        start: (callback?: EndCallback) => {
            Animated.parallel(animations, config).start(({ finished }) => {
                callback?.({ finished });
                onAnimationEnds();
            });
        },
        stop: Animated.parallel(animations, config).stop,
        reset: Animated.parallel(animations, config).reset,
    };
};

export const sequence = (animations: Array<Animated.CompositeAnimation>): Animated.CompositeAnimation => {
    return {
        start: (callback?: EndCallback) => {
            Animated.sequence(animations).start(({ finished }) => {
                callback?.({ finished });
                onAnimationEnds();
            });
        },
        stop: Animated.sequence(animations).stop,
        reset: Animated.sequence(animations).reset,
    };
};

export const spring = (
    value: Animated.Value | Animated.ValueXY,
    config: Animated.SpringAnimationConfig
): Animated.CompositeAnimation => {
    return {
        start: (callback?: EndCallback) => {
            Animated.spring(value, config).start(({ finished }) => {
                callback?.({ finished });
                onAnimationEnds();
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
                onAnimationEnds();
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
                onAnimationEnds();
            });
        },
        stop: Animated.timing(value, config).stop,
        reset: Animated.timing(value, config).reset,
    };
};

export default {
    ...Animated,
    timing,
};

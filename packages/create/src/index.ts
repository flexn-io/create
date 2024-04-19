import type { NativeSyntheticEvent } from 'react-native';

// Functions
import CoreManager from './focusManager/service/core';

export * from './rootRenderer';
export * from './tvMenuControl';

export { CoreManager };

export function setFocus(focusKey: string, direction?: FocusDirection) {
    CoreManager.setFocus(focusKey, direction);
}

export function setFocusByListOrGridIndex(index: number) {
    CoreManager.setFocusByListOrGridIndex(index);
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
export type {
    ScreenProps,
    ViewProps,
    ViewGroupProps,
    PressableProps,
    TouchableOpacityProps,
    FlashListProps,
    ScrollViewProps,
    ScreenStates,
    FocusContext,
    CreateListRenderItem,
    CreateListRenderItemInfo,
    AnimatorBackground,
    AnimatorBorder,
    AnimatorScale,
    AnimatorScaleWithBorder,
    Animator,
    ForbiddenFocusDirections,
    PressableFocusOptions,
    ScreenFocusOptions,
    RecyclableListFocusOptions,
} from './focusManager/types';

// Constants
export { ANIMATION_TYPES } from './focusManager/model/view';

// Hooks & Hocs
export { withParentContextMapper } from './hocs/withParentContextMapper';
export { useTVRemoteHandler, TVRemoteHandler } from './remoteHandler';
export type {
    RemoteHandlerCallback,
    ClassRemoteHandlerCallback,
} from './remoteHandler';
// Type declarations
import 'react-native';
import { FocusDirection } from './focusManager/types';
declare module 'react-native' {
    interface AccessibilityProps {
        accessibilityLevel?: number;
    }
}

//@ts-expect-error
declare module '@flexn/create' {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    export namespace Animated {
        type AnimatedValue = Value;
        type AnimatedValueXY = ValueXY;

        class Animated {
            // Internal class, no public API.
        }

        class AnimatedNode {
            /**
             * Adds an asynchronous listener to the value so you can observe updates from
             * animations.  This is useful because there is no way to
             * synchronously read the value because it might be driven natively.
             *
             * See https://reactnative.dev/docs/animatedvalue.html#addlistener
             */
            addListener(callback: (value: any) => any): string;
            /**
             * Unregister a listener. The `id` param shall match the identifier
             * previously returned by `addListener()`.
             *
             * See https://reactnative.dev/docs/animatedvalue.html#removelistener
             */
            removeListener(id: string): void;
            /**
             * Remove all registered listeners.
             *
             * See https://reactnative.dev/docs/animatedvalue.html#removealllisteners
             */
            removeAllListeners(): void;

            hasListeners(): boolean;
        }

        class AnimatedWithChildren extends AnimatedNode {
            // Internal class, no public API.
        }

        class AnimatedInterpolation extends AnimatedWithChildren {
            interpolate(config: InterpolationConfigType): AnimatedInterpolation;
        }

        type ExtrapolateType = 'extend' | 'identity' | 'clamp';

        type InterpolationConfigType = {
            inputRange: number[];
            outputRange: number[] | string[];
            easing?: ((input: number) => number) | undefined;
            extrapolate?: ExtrapolateType | undefined;
            extrapolateLeft?: ExtrapolateType | undefined;
            extrapolateRight?: ExtrapolateType | undefined;
        };

        type ValueListenerCallback = (state: { value: number }) => void;

        /**
         * Standard value for driving animations.  One `Animated.Value` can drive
         * multiple properties in a synchronized fashion, but can only be driven by one
         * mechanism at a time.  Using a new mechanism (e.g. starting a new animation,
         * or calling `setValue`) will stop any previous ones.
         */
        export class Value extends AnimatedWithChildren {
            constructor(value: number);

            /**
             * Directly set the value.  This will stop any animations running on the value
             * and update all the bound properties.
             */
            setValue(value: number): void;

            /**
             * Sets an offset that is applied on top of whatever value is set, whether via
             * `setValue`, an animation, or `Animated.event`.  Useful for compensating
             * things like the start of a pan gesture.
             */
            setOffset(offset: number): void;

            /**
             * Merges the offset value into the base value and resets the offset to zero.
             * The final output of the value is unchanged.
             */
            flattenOffset(): void;

            /**
             * Sets the offset value to the base value, and resets the base value to zero.
             * The final output of the value is unchanged.
             */
            extractOffset(): void;

            /**
             * Adds an asynchronous listener to the value so you can observe updates from
             * animations.  This is useful because there is no way to
             * synchronously read the value because it might be driven natively.
             */
            addListener(callback: ValueListenerCallback): string;

            removeListener(id: string): void;

            removeAllListeners(): void;

            /**
             * Stops any running animation or tracking.  `callback` is invoked with the
             * final value after stopping the animation, which is useful for updating
             * state to match the animation position with layout.
             */
            stopAnimation(callback?: (value: number) => void): void;

            /**
             * Interpolates the value before updating the property, e.g. mapping 0-1 to
             * 0-10.
             */
            interpolate(config: InterpolationConfigType): AnimatedInterpolation;
        }

        type ValueXYListenerCallback = (value: {
            x: number;
            y: number;
        }) => void;

        /**
         * 2D Value for driving 2D animations, such as pan gestures.  Almost identical
         * API to normal `Animated.Value`, but multiplexed.  Contains two regular
         * `Animated.Value`s under the hood.
         */
        export class ValueXY extends AnimatedWithChildren {
            x: AnimatedValue;
            y: AnimatedValue;

            constructor(valueIn?: {
                x: number | AnimatedValue;
                y: number | AnimatedValue;
            });

            setValue(value: { x: number; y: number }): void;

            setOffset(offset: { x: number; y: number }): void;

            flattenOffset(): void;

            extractOffset(): void;

            stopAnimation(
                callback?: (value: { x: number; y: number }) => void
            ): void;

            addListener(callback: ValueXYListenerCallback): string;

            removeListener(id: string): void;

            /**
             * Converts `{x, y}` into `{left, top}` for use in style, e.g.
             *
             *```javascript
             *  style={this.state.anim.getLayout()}
             *```
             */
            getLayout(): { [key: string]: AnimatedValue };

            /**
             * Converts `{x, y}` into a useable translation transform, e.g.
             *
             *```javascript
             *  style={{
             *    transform: this.state.anim.getTranslateTransform()
             *  }}
             *```
             */
            getTranslateTransform(): [
                { translateX: AnimatedValue },
                { translateY: AnimatedValue }
            ];
        }

        type EndResult = { finished: boolean };
        type EndCallback = (result: EndResult) => void;

        export interface CompositeAnimation {
            /**
             * Animations are started by calling start() on your animation.
             * start() takes a completion callback that will be called when the
             * animation is done or when the animation is done because stop() was
             * called on it before it could finish.
             *
             * @param callback - Optional function that will be called
             *      after the animation finished running normally or when the animation
             *      is done because stop() was called on it before it could finish
             *
             * @example
             *   Animated.timing({}).start(({ finished }) => {
             *    // completion callback
             *   });
             */
            start: (callback?: EndCallback) => void;
            /**
             * Stops any running animation.
             */
            stop: () => void;
            /**
             * Stops any running animation and resets the value to its original.
             */
            reset: () => void;
        }

        interface AnimationConfig {
            isInteraction?: boolean | undefined;
            useNativeDriver: boolean;
        }

        /**
         * Animates a value from an initial velocity to zero based on a decay
         * coefficient.
         */
        export function decay(
            value: AnimatedValue | AnimatedValueXY,
            config: DecayAnimationConfig
        ): CompositeAnimation;

        interface DecayAnimationConfig extends AnimationConfig {
            velocity: number | { x: number; y: number };
            deceleration?: number | undefined;
        }

        /**
         * Animates a value along a timed easing curve.  The `Easing` module has tons
         * of pre-defined curves, or you can use your own function.
         */
        export const timing: (
            value: AnimatedValue | AnimatedValueXY,
            config: TimingAnimationConfig
        ) => CompositeAnimation;

        interface TimingAnimationConfig extends AnimationConfig {
            toValue:
                | number
                | AnimatedValue
                | { x: number; y: number }
                | AnimatedValueXY
                | AnimatedInterpolation;
            easing?: ((value: number) => number) | undefined;
            duration?: number | undefined;
            delay?: number | undefined;
        }

        interface SpringAnimationConfig extends AnimationConfig {
            toValue:
                | number
                | AnimatedValue
                | { x: number; y: number }
                | AnimatedValueXY;
            overshootClamping?: boolean | undefined;
            restDisplacementThreshold?: number | undefined;
            restSpeedThreshold?: number | undefined;
            velocity?: number | { x: number; y: number } | undefined;
            bounciness?: number | undefined;
            speed?: number | undefined;
            tension?: number | undefined;
            friction?: number | undefined;
            stiffness?: number | undefined;
            mass?: number | undefined;
            damping?: number | undefined;
            delay?: number | undefined;
        }

        interface LoopAnimationConfig {
            iterations?: number | undefined; // default -1 for infinite
            /**
             * Defaults to `true`
             */
            resetBeforeIteration?: boolean | undefined;
        }

        /**
         * Creates a new Animated value composed from two Animated values added
         * together.
         */
        export function add(a: Animated, b: Animated): AnimatedAddition;

        class AnimatedAddition extends AnimatedInterpolation {}

        /**
         * Creates a new Animated value composed by subtracting the second Animated
         * value from the first Animated value.
         */
        export function subtract(a: Animated, b: Animated): AnimatedSubtraction;

        class AnimatedSubtraction extends AnimatedInterpolation {}

        /**
         * Creates a new Animated value composed by dividing the first Animated
         * value by the second Animated value.
         */
        export function divide(a: Animated, b: Animated): AnimatedDivision;

        class AnimatedDivision extends AnimatedInterpolation {}

        /**
         * Creates a new Animated value composed from two Animated values multiplied
         * together.
         */
        export function multiply(
            a: Animated,
            b: Animated
        ): AnimatedMultiplication;

        class AnimatedMultiplication extends AnimatedInterpolation {}

        /**
         * Creates a new Animated value that is the (non-negative) modulo of the
         * provided Animated value
         */
        export function modulo(a: Animated, modulus: number): AnimatedModulo;

        class AnimatedModulo extends AnimatedInterpolation {}

        /**
         * Create a new Animated value that is limited between 2 values. It uses the
         * difference between the last value so even if the value is far from the bounds
         * it will start changing when the value starts getting closer again.
         * (`value = clamp(value + diff, min, max)`).
         *
         * This is useful with scroll events, for example, to show the navbar when
         * scrolling up and to hide it when scrolling down.
         */
        export function diffClamp(
            a: Animated,
            min: number,
            max: number
        ): AnimatedDiffClamp;

        class AnimatedDiffClamp extends AnimatedInterpolation {}

        /**
         * Starts an animation after the given delay.
         */
        export function delay(time: number): CompositeAnimation;

        /**
         * Starts an array of animations in order, waiting for each to complete
         * before starting the next.  If the current running animation is stopped, no
         * following animations will be started.
         */
        export function sequence(
            animations: Array<CompositeAnimation>
        ): CompositeAnimation;

        /**
         * Array of animations may run in parallel (overlap), but are started in
         * sequence with successive delays.  Nice for doing trailing effects.
         */

        export function stagger(
            time: number,
            animations: Array<CompositeAnimation>
        ): CompositeAnimation;

        /**
         * Loops a given animation continuously, so that each time it reaches the end,
         * it resets and begins again from the start. Can specify number of times to
         * loop using the key 'iterations' in the config. Will loop without blocking
         * the UI thread if the child animation is set to 'useNativeDriver'.
         */

        export function loop(
            animation: CompositeAnimation,
            config?: LoopAnimationConfig
        ): CompositeAnimation;

        /**
         * Spring animation based on Rebound and Origami.  Tracks velocity state to
         * create fluid motions as the `toValue` updates, and can be chained together.
         */
        export function spring(
            value: AnimatedValue | AnimatedValueXY,
            config: SpringAnimationConfig
        ): CompositeAnimation;

        type ParallelConfig = {
            stopTogether?: boolean | undefined; // If one is stopped, stop all.  default: true
        };

        /**
         * Starts an array of animations all at the same time.  By default, if one
         * of the animations is stopped, they will all be stopped.  You can override
         * this with the `stopTogether` flag.
         */
        export function parallel(
            animations: Array<CompositeAnimation>,
            config?: ParallelConfig
        ): CompositeAnimation;

        type Mapping = { [key: string]: Mapping } | AnimatedValue;
        interface EventConfig<T> {
            listener?: ((event: NativeSyntheticEvent<T>) => void) | undefined;
            useNativeDriver: boolean;
        }

        /**
         *  Takes an array of mappings and extracts values from each arg accordingly,
         *  then calls `setValue` on the mapped outputs.  e.g.
         *
         *```javascript
         *  onScroll={Animated.event(
         *    [{nativeEvent: {contentOffset: {x: this._scrollX}}}]
         *    {listener},          // Optional async listener
         *  )
         *  ...
         *  onPanResponderMove: Animated.event([
         *    null,                // raw event arg ignored
         *    {dx: this._panX},    // gestureState arg
         *  ]),
         *```
         */
        export function event<T>(
            argMapping: Array<Mapping | null>,
            config?: EventConfig<T>
        ): (...args: any[]) => void;

        export type ComponentProps<T> = T extends
            | React.ComponentType<infer P>
            | React.Component<infer P>
            ? P
            : never;

        export type LegacyRef<C> = { getNode(): C };

        type Nullable = undefined | null;
        type Primitive = string | number | boolean | symbol;
        type Builtin = Date | Error | RegExp;

        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface WithAnimatedArray<P> extends Array<WithAnimatedValue<P>> {}
        type WithAnimatedObject<T> = {
            [K in keyof T]: WithAnimatedValue<T[K]>;
        };

        export type WithAnimatedValue<T> = T extends Builtin | Nullable
            ? T
            : T extends Primitive
            ? T | Value | AnimatedInterpolation // add `Value` and `AnimatedInterpolation` but also preserve original T
            : T extends Array<infer P>
            ? WithAnimatedArray<P>
            : T extends object
            ? WithAnimatedObject<T>
            : T; // in case it's something we don't yet know about (for .e.g bigint)

        type NonAnimatedProps = 'key' | 'ref';

        type TAugmentRef<T> = T extends React.Ref<infer R>
            ? React.Ref<R | LegacyRef<R>>
            : never;

        export type AnimatedProps<T> = {
            [key in keyof T]: key extends NonAnimatedProps
                ? key extends 'ref'
                    ? TAugmentRef<T[key]>
                    : T[key]
                : WithAnimatedValue<T[key]>;
        };

        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface AnimatedComponent<T extends React.ComponentType<any>>
            extends React.FC<AnimatedProps<React.ComponentPropsWithRef<T>>> {}

        export type AnimatedComponentOptions = {
            collapsable?: boolean;
        };

        /**
         * Make any React component Animatable.  Used to create `Animated.View`, etc.
         */
        export function createAnimatedComponent<
            T extends React.ComponentType<any>
        >(
            component: T,
            options?: AnimatedComponentOptions
        ): AnimatedComponent<T>;
    }
}

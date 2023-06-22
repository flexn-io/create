import { requireNativeComponent, ViewProps, HostComponent, ColorValue } from 'react-native';
import { AnimatorBackground, AnimatorBorder, AnimatorScale, AnimatorScaleWithBorder } from '..';

type Animator = AnimatorBackground | AnimatorBorder | AnimatorScale | AnimatorScaleWithBorder;
interface TVFocusableView extends ViewProps {
    animatorOptions?: Animator & {
        blur: {
            borderWidth?: number;
            borderRadius?: number;
            borderColor?: ColorValue;
            backgroundColor?: ColorValue;
        };
    };
}

const TvFocusableViewManager: HostComponent<TVFocusableView> = requireNativeComponent('TvFocusableView');

export default TvFocusableViewManager;

import { requireNativeComponent, ViewProps, HostComponent, ViewStyle } from 'react-native';
import { AnimatorBackground, AnimatorBorder, AnimatorScale, AnimatorScaleWithBorder } from '..';

interface TVFocusableView extends ViewProps {
    animatorOptions?: {
        animator: AnimatorBackground | AnimatorBorder | AnimatorScale | AnimatorScaleWithBorder;
        style: ViewStyle;
    };
}

const TvFocusableViewManager: HostComponent<TVFocusableView> = requireNativeComponent('TvFocusableView');

export default TvFocusableViewManager;

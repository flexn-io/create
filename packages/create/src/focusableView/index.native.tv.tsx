import { requireNativeComponent, ViewProps, HostComponent } from 'react-native';
import { AnimatorBackground, AnimatorBorder, AnimatorScale, AnimatorScaleWithBorder } from '..';

interface TVFocusableView extends ViewProps {
    animatorOptions?: AnimatorBackground | AnimatorBorder | AnimatorScale | AnimatorScaleWithBorder;
}

const TvFocusableViewManager: HostComponent<TVFocusableView> = requireNativeComponent('TvFocusableView');

export default TvFocusableViewManager;

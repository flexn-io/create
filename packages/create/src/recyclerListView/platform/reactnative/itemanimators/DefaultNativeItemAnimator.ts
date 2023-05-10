import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { BaseItemAnimator } from '../../../core/ItemAnimator';

export class DefaultNativeItemAnimator implements BaseItemAnimator {
    public shouldAnimateOnce = true;
    private _hasAnimatedOnce = false;
    private _isTimerOn = false;
    constructor() {
        if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }
    public animateWillMount(): object | undefined {
        return undefined;
    }
    public animateDidMount(): void {
        //no need
    }

    public animateWillUpdate(): void {
        this._hasAnimatedOnce = true;
    }

    public animateShift(
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        _itemRef: object,
        _itemIndex: number
    ): boolean {
        if (fromX !== toX || fromY !== toY) {
            if (!this.shouldAnimateOnce || (this.shouldAnimateOnce && !this._hasAnimatedOnce)) {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                this._hasAnimatedOnce = true;
            }
        } else {
            if (!this._isTimerOn) {
                this._isTimerOn = true;
                if (!this._hasAnimatedOnce) {
                    setTimeout(() => {
                        this._hasAnimatedOnce = true;
                    }, 1000);
                }
            }
        }
        return false;
    }

    public animateWillUnmount(): void {
        //no need
    }
}

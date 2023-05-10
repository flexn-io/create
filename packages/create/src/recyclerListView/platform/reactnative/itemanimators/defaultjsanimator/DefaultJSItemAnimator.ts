import { Animated, Easing, View } from 'react-native';
import { BaseItemAnimator } from '../../../../core/ItemAnimator';

interface UnmountAwareView extends View {
    _isUnmountedForRecyclerListView?: boolean;
    _lastAnimVal?: Animated.ValueXY | null;
}

/**
 * Default implementation of RLV layout animations for react native. These ones are purely JS driven. Also, check out DefaultNativeItemAnimator
 * for an implementation on top of LayoutAnimation. We didn't use it by default due the fact that LayoutAnimation is quite
 * unstable on Android and to avoid unnecessary interference with developer flow. It would be very easy to do so manually if
 * you need to. Check DefaultNativeItemAnimator for inspiration. LayoutAnimation definitely gives better performance but is
 * hardly customizable.
 */
export class DefaultJSItemAnimator implements BaseItemAnimator {
    public shouldAnimateOnce = true;
    private _hasAnimatedOnce = false;
    private _isTimerOn = false;
    public animateWillMount(_atX: number, _atY: number, _itemIndex: number): object | undefined {
        return undefined;
    }
    public animateDidMount(_atX: number, _atY: number, _itemRef: object, _itemIndex: number): void {
        //no need
    }

    public animateWillUpdate(
        _fromX: number,
        _fromY: number,
        _toX: number,
        _toY: number,
        _itemRef: object,
        _itemIndex: number
    ): void {
        this._hasAnimatedOnce = true;
    }

    public animateShift(
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        itemRef: object,
        _itemIndex: number
    ): boolean {
        if (fromX !== toX || fromY !== toY) {
            if (!this.shouldAnimateOnce || (this.shouldAnimateOnce && !this._hasAnimatedOnce)) {
                const viewRef = itemRef as UnmountAwareView;
                const animXY = new Animated.ValueXY({ x: fromX, y: fromY });
                animXY.addListener((value) => {
                    if (viewRef._isUnmountedForRecyclerListView || (this.shouldAnimateOnce && this._hasAnimatedOnce)) {
                        animXY.stopAnimation();
                        return;
                    }
                    viewRef.setNativeProps(this._getNativePropObject(value.x, value.y));
                });
                if (viewRef._lastAnimVal) {
                    viewRef._lastAnimVal.stopAnimation();
                }
                viewRef._lastAnimVal = animXY;
                Animated.timing(animXY, {
                    toValue: { x: toX, y: toY },
                    duration: 200,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: BaseItemAnimator.USE_NATIVE_DRIVER,
                }).start(() => {
                    viewRef._lastAnimVal = null;
                    this._hasAnimatedOnce = true;
                });
                return true;
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

    public animateWillUnmount(_atX: number, _atY: number, itemRef: object, _itemIndex: number): void {
        (itemRef as UnmountAwareView)._isUnmountedForRecyclerListView = true;
    }

    private _getNativePropObject(x: number, y: number): object {
        return { style: { left: x, top: y } };
    }
}

package io.flexn.create.scroll;

import android.animation.Animator;
import android.animation.ObjectAnimator;
import android.animation.PropertyValuesHolder;
import android.animation.ValueAnimator;
import android.content.Context;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.FabricViewStateManager;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.common.UIManagerType;
import com.facebook.react.uimanager.common.ViewUtil;
import com.facebook.react.views.scroll.FpsListener;
import com.facebook.react.views.scroll.ReactScrollViewHelper;
import java.lang.reflect.Field;

public class ReactScrollView extends com.facebook.react.views.scroll.ReactScrollView {

  private static @Nullable Field sScrollerField;
  private static boolean sTriedToGetScrollerField = false;

  private static final String CONTENT_OFFSET_LEFT = "contentOffsetLeft";
  private static final String CONTENT_OFFSET_TOP = "contentOffsetTop";
  private static final String SCROLL_AWAY_PADDING_TOP = "scrollAwayPaddingTop";

  private @Nullable ValueAnimator mScrollAnimator;
  private int mFinalAnimatedPositionScrollX;
  private int mFinalAnimatedPositionScrollY;

  private static final int UNSET_CONTENT_OFFSET = -1;

  private final FabricViewStateManager mFabricViewStateManager = new FabricViewStateManager();

  private int mScrollAwayPaddingTop = 0;

  private int mLastStateUpdateScrollX = -1;
  private int mLastStateUpdateScrollY = -1;

  public ReactScrollView(Context context) {
    super(context);
  }

  public ReactScrollView(Context context, @Nullable FpsListener fpsListener) {
    super(context, fpsListener);
  }

  @Override
  public void reactSmoothScrollTo(int x, int y) {
    if (mScrollAnimator != null) {
      mScrollAnimator.cancel();
    }

    mFinalAnimatedPositionScrollX = x;
    mFinalAnimatedPositionScrollY = y;
    PropertyValuesHolder scrollX = PropertyValuesHolder.ofInt("scrollX", getScrollX(), x);
    PropertyValuesHolder scrollY = PropertyValuesHolder.ofInt("scrollY", getScrollY(), y);
    mScrollAnimator = ObjectAnimator.ofPropertyValuesHolder(scrollX, scrollY);
    mScrollAnimator.setDuration(
        ReactScrollViewHelper.getDefaultScrollAnimationDuration(getContext()));
    mScrollAnimator.addUpdateListener(
        new ValueAnimator.AnimatorUpdateListener() {
          @Override
          public void onAnimationUpdate(ValueAnimator valueAnimator) {
            int scrollValueX = (Integer) valueAnimator.getAnimatedValue("scrollX");
            int scrollValueY = (Integer) valueAnimator.getAnimatedValue("scrollY");
            scrollTo(scrollValueX, scrollValueY);
          }
        });
    mScrollAnimator.addListener(
        new Animator.AnimatorListener() {
          @Override
          public void onAnimationStart(Animator animator) {
          }

          @Override
          public void onAnimationEnd(Animator animator) {
            mFinalAnimatedPositionScrollX = -1;
            mFinalAnimatedPositionScrollY = -1;
            mScrollAnimator = null;
            updateStateOnScroll();
          }

          @Override
          public void onAnimationCancel(Animator animator) {
          }

          @Override
          public void onAnimationRepeat(Animator animator) {
          }
        });
    mScrollAnimator.start();
    updateStateOnScroll(x, y);
  }

  /**
   * Called on any stabilized onScroll change to propagate content offset value to
   * a Shadow Node.
   */
  private boolean updateStateOnScroll(final int scrollX, final int scrollY) {
    if (ViewUtil.getUIManagerType(getId()) == UIManagerType.DEFAULT) {
      return false;
    }

    // Dedupe events to reduce JNI traffic
    if (scrollX == mLastStateUpdateScrollX && scrollY == mLastStateUpdateScrollY) {
      return false;
    }

    mLastStateUpdateScrollX = scrollX;
    mLastStateUpdateScrollY = scrollY;

    this.forceUpdateState();

    return true;
  }

  private void forceUpdateState() {
    final int scrollX = mLastStateUpdateScrollX;
    final int scrollY = mLastStateUpdateScrollY;
    final int scrollAwayPaddingTop = mScrollAwayPaddingTop;

    mFabricViewStateManager.setState(
        new FabricViewStateManager.StateUpdateCallback() {
          @Override
          public WritableMap getStateUpdate() {
            WritableMap map = new WritableNativeMap();
            map.putDouble(CONTENT_OFFSET_LEFT, PixelUtil.toDIPFromPixel(scrollX));
            map.putDouble(CONTENT_OFFSET_TOP, PixelUtil.toDIPFromPixel(scrollY));
            map.putDouble(SCROLL_AWAY_PADDING_TOP, PixelUtil.toDIPFromPixel(scrollAwayPaddingTop));
            return map;
          }
        });
  }

  private boolean updateStateOnScroll() {
    return updateStateOnScroll(getScrollX(), getScrollY());
  }
}

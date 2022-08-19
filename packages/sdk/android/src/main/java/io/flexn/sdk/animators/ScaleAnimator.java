package io.flexn.sdk.animators;

import android.animation.TimeAnimator;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.view.animation.Interpolator;
import android.widget.RelativeLayout;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.views.view.ReactViewGroup;

class ScaleAnimator extends AbstractAnimator implements TimeAnimator.TimeListener {
    private final int mDuration;
    private final float mScaleDiff;
    private float mFocusLevel = 0f;
    private float mFocusLevelStart;
    private float mFocusLevelDelta;
    private final TimeAnimator mAnimator = new TimeAnimator();
    private final Interpolator mInterpolator = new AccelerateDecelerateInterpolator();

    public void onFocus(boolean animated) {
        this.mView.setTranslationZ(1);
        animateFocus(true, false);
    }

    public void onBlur(boolean animated) {
        this.mView.setTranslationZ(0);
        animateFocus(false, false);
    }

    void animateFocus(boolean select, boolean immediate) {
        endAnimation();
        final float end = select ? 1 : 0;
        if (immediate) {
            setFocusLevel(end);
        } else if (mFocusLevel != end) {
            mFocusLevelStart = mFocusLevel;
            mFocusLevelDelta = end - mFocusLevelStart;
            mAnimator.start();
        }
    }

    ScaleAnimator(ReactViewGroup view, ReadableMap args) {
        super(view, args);

        mDuration = AnimatorProperty.getDuration();
        mScaleDiff = AnimatorProperty.getScale() - 1f;
        mAnimator.setTimeListener(this);
    }

    void setFocusLevel(float level) {
        mFocusLevel = level;
        float scale = 1f + mScaleDiff * level;
        mView.setScaleX(scale);
        mView.setScaleY(scale);
    }

    void endAnimation() {
        mAnimator.end();
    }

    @Override
    public void onTimeUpdate(TimeAnimator animation, long totalTime, long deltaTime) {
        float fraction;
        if (totalTime >= mDuration) {
            fraction = 1;
            mAnimator.end();
        } else {
            fraction = (float) (totalTime / (double) mDuration);
        }
        if (mInterpolator != null) {
            fraction = mInterpolator.getInterpolation(fraction);
        }
        setFocusLevel(mFocusLevelStart + fraction * mFocusLevelDelta);
    }
}
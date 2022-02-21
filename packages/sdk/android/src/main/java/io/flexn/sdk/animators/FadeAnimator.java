package io.flexn.sdk.animators;

import android.view.animation.AccelerateInterpolator;
import android.view.animation.DecelerateInterpolator;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.views.view.ReactViewGroup;

public class FadeAnimator extends AbstractAnimator {
    private final int mDuration;

    public FadeAnimator(ReactViewGroup view, ReadableMap args) {
        super(view, args);

        mDuration = args.hasKey("duration") ? args.getInt("duration") : 150;
    }

    @Override
    public void onFocus(boolean animated) {
        if (mChildView != null) {
            mChildView
                    .animate()
                    .alpha(1)
                    .setDuration(mDuration)
                    .setInterpolator(new DecelerateInterpolator())
                    .start();
        }
    }

    @Override
    public void onBlur(boolean animated) {
        if (mChildView != null) {
            mChildView
                    .animate()
                    .alpha(0)
                    .setDuration(mDuration)
                    .setInterpolator(new AccelerateInterpolator())
                    .start();
        }
    }
}

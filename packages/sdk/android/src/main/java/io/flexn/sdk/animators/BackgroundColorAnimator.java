package io.flexn.sdk.animators;

import android.animation.ValueAnimator;
import android.os.Build;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.views.view.ReactViewGroup;

public class BackgroundColorAnimator extends AbstractAnimator {
    public BackgroundColorAnimator(ReactViewGroup view, ReadableMap args) {
        super(view, args);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onFocus(boolean animated) {
        if (animated) {
            final ValueAnimator animator = ValueAnimator.ofArgb(AnimatorProperty.getBackgroundColorBlur(), AnimatorProperty.getBackgroundColor());
            ReactViewGroup v = mView;
            animator.setDuration(AnimatorProperty.getDuration()).addUpdateListener(animation -> {
                int value = (int) animation.getAnimatedValue();
                v.setBackgroundColor(value);

            });
            animator.start();
        } else {
            mView.setBackgroundColor(AnimatorProperty.getBackgroundColor());
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onBlur(boolean animated) {
        if (animated) {
            final ValueAnimator animator = ValueAnimator.ofArgb(AnimatorProperty.getBackgroundColor(), AnimatorProperty.getBackgroundColorBlur());
            ReactViewGroup v = mView;
            animator.setDuration(AnimatorProperty.getDuration()).addUpdateListener(animation -> {
                int value = (int) animation.getAnimatedValue();
                v.setBackgroundColor(value);
            });
            animator.start();
        } else {
            mView.setBackgroundColor(AnimatorProperty.getBackgroundColorBlur());
        }
    }
}

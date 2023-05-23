package io.flexn.create.animators;

import android.animation.ValueAnimator;
import android.os.Build;
import android.util.Log;

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
            final ValueAnimator animator = ValueAnimator.ofArgb(AnimatorProperty2.blurBackgroundColor, AnimatorProperty2.focusBackgroundColor);
            ReactViewGroup v = mView;
            animator.setDuration(AnimatorProperty2.focusDuration).addUpdateListener(animation -> {
                int value = (int) animation.getAnimatedValue();
                v.setBackgroundColor(value);

            });
            animator.start();
        } else {
            mView.setBackgroundColor(AnimatorProperty2.focusBackgroundColor);
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onBlur(boolean animated) {
        if (animated) {
            final ValueAnimator animator = ValueAnimator.ofArgb(AnimatorProperty2.focusBackgroundColor, AnimatorProperty2.blurBackgroundColor);
            ReactViewGroup v = mView;
            animator.setDuration(AnimatorProperty2.blurDuration).addUpdateListener(animation -> {
                int value = (int) animation.getAnimatedValue();
                v.setBackgroundColor(value);
            });
            animator.start();
        } else {
            mView.setBackgroundColor(AnimatorProperty2.blurBackgroundColor);
        }
    }
}

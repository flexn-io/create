package io.flexn.sdk.animators;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ValueAnimator;
import android.graphics.Color;
import android.os.Build;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.Spacing;
import com.facebook.react.views.view.ReactViewGroup;

public class BackgroundColorAnimator extends AbstractAnimator {
    private final int mBackgroundColorBlur;
    private final int mBackgroundColorFocus;
    private final int mDuration;

    public BackgroundColorAnimator(ReactViewGroup view, ReadableMap args) {
        super(view, args);

        mBackgroundColorBlur = args.hasKey("colorBlur") ? Color.parseColor(args.getString("colorBlur")) : Color.BLACK;
        mBackgroundColorFocus = args.hasKey("colorFocus") ? Color.parseColor(args.getString("colorFocus")) : Color.RED;
        mDuration = args.hasKey("duration") ? args.getInt("duration") : 150;
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onFocus(boolean animated) {
        if (animated) {
            final ValueAnimator animator = ValueAnimator.ofArgb(mBackgroundColorBlur, mBackgroundColorFocus);
            ReactViewGroup v = mView;
            animator.setDuration(mDuration).addUpdateListener(animation -> {
                int value = (int) animation.getAnimatedValue();
                v.setBackgroundColor(value);

            });
            animator.start();
        } else {
            mView.setBackgroundColor(mBackgroundColorFocus);
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onBlur(boolean animated) {
        if (animated) {
            final ValueAnimator animator = ValueAnimator.ofArgb(mBackgroundColorFocus, mBackgroundColorBlur);
            ReactViewGroup v = mView;
            animator.setDuration(mDuration).addUpdateListener(animation -> {
                int value = (int) animation.getAnimatedValue();
                v.setBackgroundColor(value);
            });
            animator.start();
        } else {
            mView.setBackgroundColor(mBackgroundColorBlur);
        }
    }
}

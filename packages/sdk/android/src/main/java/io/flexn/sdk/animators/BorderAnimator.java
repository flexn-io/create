package io.flexn.sdk.animators;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ValueAnimator;
import android.graphics.Color;
import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.Spacing;
import com.facebook.react.views.view.ReactViewGroup;

public class BorderAnimator extends AbstractAnimator {
    private final String mBorderStyle;
    private final int mBorderWidth;
    private final int mBorderColorBlur;
    private final int mBorderColorFocus;
    private final int mDuration;

    public BorderAnimator(ReactViewGroup view, ReadableMap args) {
        super(view, args);
        mBorderStyle = args.hasKey("borderStyle") ? args.getString("borderStyle") : "solid";
        mBorderWidth = args.hasKey("borderWidth") ? args.getInt("borderWidth") : 1;
        mBorderColorBlur = args.hasKey("colorBlur") ? Color.parseColor(args.getString("colorBlur")) : -1;
        mBorderColorFocus = args.hasKey("colorFocus") ? Color.parseColor(args.getString("colorFocus")) : Color.BLACK;
        mDuration = args.hasKey("duration") ? args.getInt("duration") : 150;
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onFocus(boolean animated) {
        if (animated) {
            final ValueAnimator animator = ValueAnimator.ofArgb(Color.TRANSPARENT, mBorderColorFocus);
            ReactViewGroup v = mView;
            animator.setDuration(mDuration).addUpdateListener(animation -> {
                int value = (int) animation.getAnimatedValue();
                v.setBorderColor(Spacing.ALL, value, Color.alpha(value));

            });

            v.setBorderColor(Spacing.ALL, Color.TRANSPARENT, Color.alpha(Color.TRANSPARENT));
            v.setBorderStyle(mBorderStyle);
            v.setBorderWidth(Spacing.ALL, mBorderWidth);
            animator.start();
        } else {
            mView.setBorderColor(Spacing.ALL, mBorderColorFocus, Color.alpha(mBorderColorFocus));
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onBlur(boolean animated) {
        if (animated) {
            final ValueAnimator animator = ValueAnimator.ofArgb(mBorderColorFocus, mBorderColorBlur);
            ReactViewGroup v = mView;
            if (mBorderColorBlur != -1) {
                animator.setDuration(mDuration).addUpdateListener(animation -> {
                    int value = (int) animation.getAnimatedValue();
                    v.setBorderColor(Spacing.ALL, value, Color.alpha(value));
                });
            } else {
                animator.addListener(new AnimatorListenerAdapter() {
                    @Override
                    public void onAnimationEnd(Animator animation) {
                        v.setBorderWidth(Spacing.ALL, 0);
                    }
                });
            }
            animator.start();
        } else {
            mView.setBorderColor(Spacing.ALL, mBorderColorBlur, Color.alpha(mBorderColorBlur));
        }
    }
}

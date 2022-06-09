package io.flexn.sdk;

import android.content.Context;
import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.views.view.ReactViewGroup;
import io.flexn.sdk.animators.AbstractAnimator;
import io.flexn.sdk.animators.AnimatorSelector;

public class Focusable extends ReactViewGroup {
    private AbstractAnimator animator;

    private boolean isFocused = false;

    public Focusable(Context context) {
        super(context);
    }

    public void addSubView(View child) {
        if (animator != null) {
            animator.addChildView(child);
        }
    }

    public void setupAnimator(ReadableMap args) {
        if (animator != null) {
//            animator = null;
        }
        if (animator == null) {
            animator = AnimatorSelector.selectAnimator(this, args);
        }
        Log.d("args2", animator.toString());
//        if (isFocused) {
//            this.focus(false);
//        } else {
//            this.blur(false);
//        }
    }

    public void focus(boolean animated) {
        if (animator != null) {
            animator.onFocus(animated);
            isFocused = true;
        }
    }

    public void blur(boolean animated) {
        if (animator != null) {
            animator.onBlur(animated);
            isFocused = false;
        }
    }
}

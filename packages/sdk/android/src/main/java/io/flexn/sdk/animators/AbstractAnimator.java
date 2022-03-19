package io.flexn.sdk.animators;

import android.view.View;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.views.view.ReactViewGroup;

public abstract class AbstractAnimator {
    protected ReactViewGroup mView;
    protected View mChildView;
    protected ReadableMap mArgs;

    protected AnimatorProperty AnimatorProperty;

    public AbstractAnimator(ReactViewGroup view, ReadableMap args) {
        this.mView = view;
        this.mArgs = args;
        this.AnimatorProperty = new AnimatorProperty(args);
    }

    public abstract void onFocus(boolean animated);

    public abstract void onBlur(boolean animated);

    public void addChildView(View child) {
        mChildView = child;
    }
}

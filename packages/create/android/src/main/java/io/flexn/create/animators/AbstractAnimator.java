package io.flexn.create.animators;

import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.views.view.ReactViewGroup;

public abstract class AbstractAnimator {
    protected ReactViewGroup mView;
    protected View mChildView;
    protected ReadableMap mArgs;

    protected AnimatorProperty AnimatorProperty2;

    public AbstractAnimator(ReactViewGroup view, ReadableMap args) {
        this.mView = view;
        this.mArgs = args;
        this.AnimatorProperty2 = new AnimatorProperty(args);
//        Log.d("HOW_MANY", "TIMESS_HERE");
    }

    public abstract void onFocus(boolean animated);

    public abstract void onBlur(boolean animated);

    public void addChildView(View child) {
        mChildView = child;
    }
}

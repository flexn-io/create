package io.flexn.sdk.animators;

import android.os.Build;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.views.view.ReactViewGroup;

public class ScaleWithBorderAnimator extends AbstractAnimator {
    private final BorderAnimator borderAnimator;
    private final ScaleAnimator scaleAnimator;

    public ScaleWithBorderAnimator(ReactViewGroup view, ReadableMap args) {
        super(view, args);

        borderAnimator = new BorderAnimator(view, args);
        scaleAnimator = new ScaleAnimator(view, args);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onFocus(boolean animated) {
        borderAnimator.onFocus(animated);
        scaleAnimator.onFocus(animated);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onBlur(boolean animated) {
        borderAnimator.onBlur(animated);
        scaleAnimator.onBlur(animated);
    }
}

package io.flexn.create.animators;

import android.graphics.Color;
import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.Spacing;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.yoga.YogaConstants;
import io.flexn.create.animators.AnimatorProperty;

public class BorderAnimator extends AbstractAnimator {
    public BorderAnimator(ReactViewGroup view, ReadableMap args) {
        super(view, args);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onFocus(boolean animated) {
        mView.setBorderWidth(Spacing.ALL, AnimatorProperty2.focusBorderWidth);
        mView.setBorderColor(Spacing.ALL, AnimatorProperty2.focusBorderColor, AnimatorProperty2.focusBorderColorAlpha);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onBlur(boolean animated) {
        mView.setBorderWidth(Spacing.ALL, AnimatorProperty2.blurBorderWidth);
        mView.setBorderColor(Spacing.ALL, AnimatorProperty2.blurBorderColor, AnimatorProperty2.blurBorderColorAlpha);
    }
}
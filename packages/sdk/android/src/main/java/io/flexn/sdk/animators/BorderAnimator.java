package io.flexn.sdk.animators;

import android.os.Build;
import androidx.annotation.RequiresApi;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.Spacing;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.yoga.YogaConstants;

public class BorderAnimator extends AbstractAnimator {
    public BorderAnimator(ReactViewGroup view, ReadableMap args) {
        super(view, args);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onFocus(boolean animated) {
        mView.setBorderWidth(Spacing.ALL, AnimatorProperty.getBorderWidth());
        mView.setBorderColor(Spacing.ALL, AnimatorProperty.getBorderColor(), AnimatorProperty.getBorderColorAlpha());
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public void onBlur(boolean animated) {
        mView.setBorderWidth(Spacing.ALL, YogaConstants.UNDEFINED);
    }
}

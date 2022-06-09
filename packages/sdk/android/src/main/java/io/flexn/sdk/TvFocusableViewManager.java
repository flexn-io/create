package io.flexn.sdk;

import android.util.Log;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ViewProps;
import com.facebook.react.uimanager.Spacing;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.annotations.ReactPropGroup;
import com.facebook.yoga.YogaConstants;

public class TvFocusableViewManager extends ViewGroupManager<Focusable> {
    private static final int[] SPACING_TYPES = {
        Spacing.ALL,
        Spacing.LEFT,
        Spacing.RIGHT,
        Spacing.TOP,
        Spacing.BOTTOM,
        Spacing.START,
        Spacing.END,
    };

    public static final String BORDER_WIDTH = "focusableBorderWidth";
    public static final String BORDER_LEFT_WIDTH = "focusableBorderLeftWidth";
    public static final String BORDER_START_WIDTH = "focusableBorderStartWidth";
    public static final String BORDER_END_WIDTH = "focusableBorderEndWidth";
    public static final String BORDER_TOP_WIDTH = "focusableBorderTopWidth";
    public static final String BORDER_RIGHT_WIDTH = "focusableBorderRightWidth";
    public static final String BORDER_BOTTOM_WIDTH = "focusableBorderBottomWidth";

    public static final String REACT_CLASS = "TvFocusableView";
    public static final String COMMAND_FOCUS = "cmdFocus";
    public static final String COMMAND_BLUR = "cmdBlur";

    @Override
    @NonNull
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    @NonNull
    public Focusable createViewInstance(ThemedReactContext reactContext) {
        return new Focusable(reactContext);
    }

    @Override
    public void addView(Focusable parent, View child, int index) {
        super.addView(parent, child, index);
        parent.addSubView(child);
    }

    @ReactProp(name = "animatorOptions")
    public void setAnimationType(Focusable view, ReadableMap args) {
        Log.d("args", args.toString());
        view.setupAnimator(args);
    }

    @ReactPropGroup(
        names = {
                BORDER_WIDTH,
                BORDER_LEFT_WIDTH,
                BORDER_START_WIDTH,
                BORDER_END_WIDTH,
                BORDER_TOP_WIDTH,
                BORDER_RIGHT_WIDTH,
                BORDER_BOTTOM_WIDTH,
        },
        defaultFloat = YogaConstants.UNDEFINED)
    public void setBorderWidth(Focusable view, int index, float width) {
        if (!YogaConstants.isUndefined(width) && width < 0) {
            width = YogaConstants.UNDEFINED;
        }
        if (!YogaConstants.isUndefined(width)) {
            width = PixelUtil.toPixelFromDIP(width);
        }
        view.setBorderWidth(SPACING_TYPES[index], width);
    }

    @ReactPropGroup(
        names = {
            ViewProps.BORDER_COLOR,
            ViewProps.BORDER_LEFT_COLOR,
            ViewProps.BORDER_RIGHT_COLOR,
            ViewProps.BORDER_TOP_COLOR,
            ViewProps.BORDER_BOTTOM_COLOR,
            ViewProps.BORDER_START_COLOR,
            ViewProps.BORDER_END_COLOR
        },
        customType = "Color")
    public void setBorderColor(Focusable view, int index, Integer color) {
        float rgbComponent =
            color == null ? YogaConstants.UNDEFINED : (float) ((int) color & 0x00FFFFFF);
        float alphaComponent = color == null ? YogaConstants.UNDEFINED : (float) ((int) color >>> 24);
        view.setBorderColor(SPACING_TYPES[index], rgbComponent, alphaComponent);
    }

    @ReactProp(name = "borderRadius")
    public void setBorderRadius(Focusable view, float borderRadius) {
        view.setBorderRadius(PixelUtil.toPixelFromDIP(borderRadius));
    }

    @ReactProp(name = "borderStyle")
    public void setBorderStyle(Focusable view, @Nullable String borderStyle) {
        view.setBorderStyle(borderStyle);
    }

    @Override
    public void receiveCommand(Focusable view, String commandId, @Nullable ReadableArray args) {
        super.receiveCommand(view, commandId, args);
        if (commandId.equals(COMMAND_FOCUS)) {
            view.focus(true);
        } else if (commandId.equals(COMMAND_BLUR)){
            view.blur(true);
        }
    }
}

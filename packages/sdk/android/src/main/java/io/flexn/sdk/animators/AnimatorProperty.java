package io.flexn.sdk.animators;

import android.graphics.Color;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.yoga.YogaConstants;

public class AnimatorProperty {
    private ReadableMap style;
    private int duration = 150;
    private float scale = 1.2f;
    private float borderColor = YogaConstants.UNDEFINED;
    private float borderColorAlpha = YogaConstants.UNDEFINED;
    private float borderWidth = YogaConstants.UNDEFINED;
    private int backgroundColorFocus;
    private int backgroundColor;

    public AnimatorProperty(ReadableMap args) {
        if (args.hasKey("style")) {
            setStyle(args.getMap("style"));
            if (style.hasKey("borderColor")) setBorderColor(style.getString("borderColor"));
            if (style.hasKey("backgroundColor")) setBackgroundColor(style.getString("backgroundColor"));
            if (style.hasKey("borderWidth")) setBorderWidth(style.getInt("borderWidth"));
            if (args.hasKey("backgroundColorFocus")) setBackgroundColorFocus(args.getString("backgroundColorFocus"));
            if (args.hasKey("scale")) setScale((float) args.getDouble("scale"));
            if (args.hasKey("duration")) setDuration(args.getInt("duration"));
        }
    }

    public void setStyle(ReadableMap style) {
        this.style = style;
    }

    public ReadableMap getStyle() {
        return style;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public float getScale() {
        return scale;
    }

    public void setScale(float scale) {
        this.scale = scale;
    }

    private void setStyle() {
    }

    public float getBorderColor() {
        return borderColor;
    }

    public void setBorderColor(String borderColor) {
        try {
            int color = Color.parseColor(borderColor);
            float rgbComponent =  (float) ((int) color & 0x00FFFFFF);
            float alphaComponent = (float) ((int) color >>> 24);

            this.borderColor = rgbComponent;
            setBorderColorAlpha(alphaComponent);
        } catch (Exception e) {
            this.borderColor = Color.TRANSPARENT;
            setBorderColorAlpha(0);
        }
    }

    public float getBorderColorAlpha() {
        return borderColorAlpha;
    }

    public void setBorderColorAlpha(float borderColorAlpha) {
        this.borderColorAlpha = borderColorAlpha;
    }

    public float getBorderWidth() {
        return borderWidth;
    }

    public void setBorderWidth(int borderWidth) {
        if (borderWidth < 0) {
            this.borderWidth = YogaConstants.UNDEFINED;
        }

        this.borderWidth = PixelUtil.toPixelFromDIP(borderWidth);
    }

    public int getBackgroundColorFocus() {
        return backgroundColorFocus;
    }

    public void setBackgroundColorFocus(String backgroundColorFocus) {
        try {
            this.backgroundColorFocus = Color.parseColor(backgroundColorFocus);
        } catch (Exception e) {
            this.backgroundColorFocus = Color.BLACK;
        }
    }

    public int getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(String backgroundColor) {
        try {
            this.backgroundColor = Color.parseColor(backgroundColor);
        } catch (Exception e) {
            this.backgroundColor = Color.BLACK;
        }
    }
}

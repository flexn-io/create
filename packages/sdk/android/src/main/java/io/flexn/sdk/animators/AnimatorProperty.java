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
    private int backgroundColorBlur;
    private int backgroundColor;

    public AnimatorProperty(ReadableMap args) {
        if (args.hasKey("style")) {
            setStyle(args.getMap("style"));
            if (style.hasKey("borderColor")) setBorderColor(style.getString("borderColor"));
            if (style.hasKey("backgroundColorBlur")) setBackgroundColorBlur(style.getString("backgroundColorBlur"));
            if (style.hasKey("backgroundColor")) setBackgroundColor(style.getString("backgroundColor"));
            if (style.hasKey("borderWidth")) setBorderWidth(style.getInt("borderWidth"));
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
        int color = Color.parseColor(borderColor);
        float rgbComponent =  (float) ((int) color & 0x00FFFFFF);
        float alphaComponent = (float) ((int) color >>> 24);

        this.borderColor = rgbComponent;
        setBorderColorAlpha(alphaComponent);
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

    public int getBackgroundColorBlur() {
        return backgroundColorBlur;
    }

    public void setBackgroundColorBlur(String backgroundColorBlur) {
        this.backgroundColorBlur = Color.parseColor(backgroundColorBlur);
    }

    public int getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(String backgroundColor) {
        this.backgroundColor = Color.parseColor(backgroundColor);
    }
}

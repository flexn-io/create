package io.flexn.create.animators;

import android.graphics.Color;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.yoga.YogaConstants;

import java.util.Objects;

public class AnimatorProperty {
    public int duration = 150;
    public float scale = 1.2f;

    public int focusDuration = 150;
    public float focusScale = 1.2f;
    public float focusBorderColor;
    public float focusBorderColorAlpha;
    public int focusBackgroundColor;
    public float focusBorderWidth;

    public int blurDuration = 150;
    public float blurScale = 1.2f;
    public float blurBorderColor;
    public float blurBorderColorAlpha;
    public int blurBackgroundColor;
    public float blurBorderWidth;

    public AnimatorProperty(ReadableMap args) {
        if (args.hasKey("scale")) this.scale = (float) args.getDouble("scale");
        if (args.hasKey("duration")) this.duration = args.getInt("duration");

        if (args.hasKey("animator")) {
            if (args.getMap("focus").hasKey("borderWidth")) {
                this.focusBorderWidth = parseNumber(args.getMap("focus").getInt("borderWidth"));
            }

            float[] colors = parseColor(Objects.requireNonNull(args.getMap("focus")).getString("borderColor"));
            this.focusBorderColor = colors[0];
            this.focusBorderColorAlpha = colors[1];

            this.focusBackgroundColor = parseIntColor(Objects.requireNonNull(args.getMap("focus")).getString("backgroundColor"));

            if (args.getMap("focus").hasKey("scale")) {
                this.focusScale = (float) args.getMap("focus").getDouble("scale");
            }
            if (args.getMap("focus").hasKey("duration")) {
                this.focusDuration = args.getMap("focus").getInt("duration");
            }
        }

        if (args.hasKey("blur")) {
            if (args.getMap("blur").hasKey("borderWidth")) {
                this.blurBorderWidth = parseNumber(args.getMap("blur").getInt("borderWidth"));
            }

            float[] colors = parseColor(Objects.requireNonNull(args.getMap("blur")).getString("borderColor"));
            this.blurBorderColor = colors[0];
            this.blurBorderColorAlpha = colors[1];

            this.blurBackgroundColor = parseIntColor(Objects.requireNonNull(args.getMap("blur")).getString("backgroundColor"));

            if (args.getMap("blur").hasKey("scale")) {
                this.blurScale = (float) args.getMap("blur").getDouble("scale");
            }
            if (args.getMap("blur").hasKey("duration")) {
                this.blurDuration = args.getMap("blur").getInt("duration");
            }
        }
    }

    public static float[] parseColor(String reactColor) {
        float rgbComponent;
        float alphaComponent;
        try {
            int color = Color.parseColor(reactColor);
            rgbComponent =  (float) ((int) color & 0x00FFFFFF);
            alphaComponent = (float) ((int) color >>> 24);
        } catch (Exception e) {
            rgbComponent = YogaConstants.UNDEFINED;
            alphaComponent = 0;
        }

        return new float[]{rgbComponent, alphaComponent};
    }

    public int parseIntColor(String reactColor) {
        try {
            return Color.parseColor(reactColor);
        } catch (Exception e) {
            return Color.TRANSPARENT;
        }
    }


    public float parseNumber(@Nullable int borderWidth) {
        if (borderWidth < 0) {
            return YogaConstants.UNDEFINED;
        }

        return PixelUtil.toPixelFromDIP(borderWidth);
    }
}

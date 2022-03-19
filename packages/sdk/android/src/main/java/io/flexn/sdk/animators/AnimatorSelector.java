package io.flexn.sdk.animators;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.Objects;

public class AnimatorSelector {
    private static final String ANIMATION_TYPE_SCALE = "scale";
    private static final String ANIMATION_TYPE_SCALE_WITH_BORDER = "scale_with_border";
    private static final String ANIMATION_TYPE_BORDER = "border";
    private static final String ANIMATION_TYPE_FADE = "fade";
    private static final String ANIMATION_TYPE_BG_COLOR = "background";

    public static AbstractAnimator selectAnimator(ReactViewGroup view, ReadableMap args) {
        AbstractAnimator animator = null;
        String animationType = args.getString("type");

        switch (Objects.requireNonNull(animationType)) {
            case ANIMATION_TYPE_SCALE:
                animator = new ScaleAnimator(view, args);
                break;
            case ANIMATION_TYPE_BORDER:
                animator = new BorderAnimator(view, args);
                break;
            case ANIMATION_TYPE_SCALE_WITH_BORDER:
                animator = new ScaleWithBorderAnimator(view, args);
                break;
            case ANIMATION_TYPE_FADE:
                animator = new FadeAnimator(view, args);
                break;
            case ANIMATION_TYPE_BG_COLOR:
                animator = new BackgroundColorAnimator(view, args);
                break;
            default:
                break;
        }

        return animator;
    }
}

/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package io.flexn.create.scroll;

import androidx.annotation.Nullable;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.scroll.FpsListener;

/**
 * View manager for {@link ReactScrollView} components.
 *
 * <p>
 * Note that {@link ReactScrollView} and {@link ReactHorizontalScrollView} are
 * exposed to JS as a
 * single ScrollView component, configured via the {@code horizontal} boolean
 * property.
 */
@ReactModule(name = ReactScrollViewManager.REACT_CLASS)
public class ReactScrollViewManager extends com.facebook.react.views.scroll.ReactScrollViewManager {

  public static final String REACT_CLASS = "RCTScrollViewTV";

  private @Nullable FpsListener mFpsListener = null;

  public ReactScrollViewManager() {
    this(null);
  }

  public ReactScrollViewManager(@Nullable FpsListener fpsListener) {
    mFpsListener = fpsListener;
  }

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  public ReactScrollView createViewInstance(ThemedReactContext context) {
    return new ReactScrollView(context, mFpsListener);
  }
}

package io.flexn.create;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import io.flexn.create.scroll.ReactScrollViewManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class FlexnCreatePackage implements ReactPackage {

    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new TvRemoteHandlerModule(reactContext));
        return modules;
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        List<ViewManager> views = new ArrayList<>();

        views.add(new TvFocusableViewManager());
        views.add(new ReactScrollViewManager());

        return views;
    }
}

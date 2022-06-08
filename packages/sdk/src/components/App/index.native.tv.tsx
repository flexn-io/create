import React, { useEffect, useRef } from 'react';
import { useTVRemoteHandler } from '../../remoteHandler';
import {
    TVEventHandler,
    View as RNView,
    ScrollView as RNScrollView,
    TouchableOpacity,
    findNodeHandle,
} from 'react-native';
import { isPlatformAndroidtv, isPlatformTvos, isPlatformFiretv } from '@rnv/renative';
import CoreManager from '../../focusManager/model/core';
import { DIRECTION } from '../../focusManager/constants';

const isAndroidBased = isPlatformAndroidtv || isPlatformFiretv;

export default function App({ children, ...props }: { children: any }) {
    const focusTrapRef = useRef<TouchableOpacity>(null);
    const tvEventHandler = useRef<any>(null);
    useEffect(() => {
        tvEventHandler.current = new TVEventHandler();
        tvEventHandler.current.enable(null, (_: any, evt: any) => {
            const direction = evt.eventType;
            if (isPlatformTvos) {
                if (direction === 'playPause') {
                    console.log(CoreManager);
                    CoreManager.debuggerEnabled = !CoreManager.isDebuggerEnabled;
                }
                if (direction === 'select') {
                    // This can happen if we opened new screen which doesn't have any focusable
                    // then last screen in context map still keeping focus
                    const currentFocus = CoreManager.getCurrentFocus();
                    if (currentFocus && currentFocus?.getScreen()?.isInForeground()) {
                        currentFocus.onPress();
                    }
                }
            }
        });

        const node = isAndroidBased && findNodeHandle(focusTrapRef.current);
        if (node && focusTrapRef.current) {
            focusTrapRef.current.setNativeProps({
                nextFocusRight: node,
                nextFocusLeft: node,
                nextFocusUp: node,
                nextFocusDown: node,
            });
        }
    }, []);

    useTVRemoteHandler((evt: any) => {
        if (evt && evt.eventKeyAction === 'down') {
            const direction = evt.eventType;
            if (isAndroidBased) {
                if (direction === 'playPause') {
                    CoreManager.debuggerEnabled = !CoreManager.isDebuggerEnabled;
                }
                if (isAndroidBased && direction === 'select' && CoreManager.getCurrentFocus()) {
                    CoreManager.getCurrentFocus()?.onPress();
                }
            }

            // DO NOT START LISTENING IF THERE IS NO CURRENT CONTEXT YET
            if (CoreManager.getCurrentFocus()) {
                if (CoreManager.hasPendingUpdateGuideLines) {
                    CoreManager.executeUpdateGuideLines();
                }
                if (DIRECTION.includes(evt.eventType)) {
                    CoreManager.executeDirectionalFocus(direction);
                    CoreManager.executeScroll(direction);
                    CoreManager.executeUpdateGuideLines();
                }
            }
        }
    });

    return (
        <RNView style={{ flex: 1 }} {...props}>
            {/* 
                This needs to be injected into native ScrollView directly and will come in phase2.
                For now it's workaround to prevent jumping when native focus is disabled.
            */}
            {isAndroidBased && (
                <RNView style={{ width: 0, height: 0 }}>
                    <RNScrollView>
                        <TouchableOpacity ref={focusTrapRef} hasTVPreferredFocus />
                    </RNScrollView>
                </RNView>
            )}
            {children}
        </RNView>
    );
}

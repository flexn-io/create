import React, { useEffect, useRef } from 'react';
import { useTVRemoteHandler } from '../../remoteHandler';
import { TVEventHandler, View as RNView, ScrollView as RNScrollView, TouchableOpacity, findNodeHandle } from 'react-native';
import { isPlatformAndroidtv, isPlatformTvos, isPlatformFiretv } from 'renative';
import CoreManager from '../../focusManager/core';
import { DIRECTION, SCREEN_STATES } from '../../focusManager/constants';

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
                    CoreManager.debuggerEnabled = !CoreManager.isDebuggerEnabled;
                }
                if (
                    direction === 'select' &&
                    typeof CoreManager.currentContext?.node?.current?.onPress === 'function'
                ) {
                    // This can happen if we opened new screen which doesn't have any focusable
                    // then last screen in context map still keeping focus
                    if (CoreManager.currentContext?.screen?.state === SCREEN_STATES.FOREGROUND) {
                        CoreManager.currentContext.node.current.onPress();
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
                if (
                    isAndroidBased &&
                    direction === 'select' &&
                    typeof CoreManager.currentContext?.node?.current?.onPress === 'function'
                ) {
                    CoreManager.currentContext.node.current.onPress();
                }
            }

            // DO NOT START LISTENING IF THERE IS NO CURRENT CONTEXT YET
            if (CoreManager.currentContext) {
                if (CoreManager.hasPendingUpdateGuideLines) {
                    CoreManager.executeUpdateGuideLines();
                }
                if (DIRECTION.includes(evt.eventType)) {
                    CoreManager.executeFocus(direction);
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

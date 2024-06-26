import React, { useEffect, useRef } from 'react';
import {
    View as RNView,
    ScrollView as RNScrollView,
    TouchableOpacity,
    findNodeHandle,
    ViewProps,
    Platform,
} from 'react-native';
import { CoreManager } from '../..';
import KeyHandler from '../../focusManager/service/keyHandler';

export default function App({ children, ...props }: ViewProps) {
    const isAndroidBased = CoreManager.isTV() && Platform.OS === 'android';

    if (!CoreManager.isFocusManagerEnabled()) {
        return <RNView {...props}>{children}</RNView>;
    }

    const focusTrapRef = useRef<TouchableOpacity>(null);
    useEffect(() => {
        const Handler = new KeyHandler();

        const node = isAndroidBased && findNodeHandle(focusTrapRef.current);
        if (node && focusTrapRef.current) {
            focusTrapRef.current.setNativeProps({
                nextFocusRight: node,
                nextFocusLeft: node,
                nextFocusUp: node,
                nextFocusDown: node,
            });
        }

        return () => {
            Handler.removeListeners();
        };
    }, []);

    return (
        <RNView style={{ flex: 1 }} {...props}>
            {/* 
                This needs to be injected into native ScrollView directly and will come in phase2.
                For now it's workaround to prevent jumping when native focus is disabled.
            */}
            {isAndroidBased && (
                <RNView style={{ width: 0, height: 0 }}>
                    <RNScrollView>
                        <TouchableOpacity
                            ref={focusTrapRef}
                            hasTVPreferredFocus
                        />
                    </RNScrollView>
                </RNView>
            )}
            {children}
        </RNView>
    );
}

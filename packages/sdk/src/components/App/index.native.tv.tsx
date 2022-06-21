import React, { useEffect, useRef } from 'react';
import {
    View as RNView,
    ScrollView as RNScrollView,
    TouchableOpacity,
    findNodeHandle,
} from 'react-native';
import { isPlatformAndroidtv, isPlatformFiretv } from '@rnv/renative';
import KeyHandler from '../../focusManager/model/keyHandler';

const isAndroidBased = isPlatformAndroidtv || isPlatformFiretv;

export default function App({ children, ...props }: { children: any }) {
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
                        <TouchableOpacity ref={focusTrapRef} hasTVPreferredFocus />
                    </RNScrollView>
                </RNView>
            )}
            {children}
        </RNView>
    );
}

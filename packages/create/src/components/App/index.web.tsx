import React, { useEffect } from 'react';
import { View as RNView } from 'react-native';
import { CoreManager } from '../..';
import KeyHandler from '../../focusManager/service/keyHandler';

export default function App({ children, ...props }: { children: any }) {
    if (!CoreManager.isFocusManagerEnabled()) {
        return <RNView {...props}>{children}</RNView>;
    }

    useEffect(() => {
        const Handler = new KeyHandler();

        return () => {
            Handler.removeListeners();
        };
    }, []);

    return (
        <RNView style={{ flex: 1 }} {...props}>
            {children}
        </RNView>
    );
}

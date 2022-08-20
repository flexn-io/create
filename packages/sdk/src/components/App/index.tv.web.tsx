import React, { useEffect } from 'react';
import {
    View as RNView
} from 'react-native';
import KeyHandler from '../../focusManager/model/keyHandler';


export default function App({ children, ...props }: { children: any }) {
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

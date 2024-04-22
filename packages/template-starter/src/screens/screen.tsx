import { Screen as FMScreen, ScreenProps, ScreenStates } from '@flexn/create';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '../hooks';
import { useWindowDimensions } from 'react-native';

const Screen = ({ children, focusOptions, style, ...rest }: ScreenProps) => {
    const [screenState, setScreenState] = useState<ScreenStates>('foreground');
    const { height, width } = useWindowDimensions();

    useFocusEffect(
        useCallback(() => {
            setScreenState('foreground');

            return () => {
                setScreenState('background');
            };
        }, [])
    );

    return (
        <FMScreen
            focusOptions={{ ...focusOptions, screenState }}
            style={[style, { minHeight: height, minWidth: width }]}
            {...rest}
        >
            {children}
        </FMScreen>
    );
};

export default Screen;

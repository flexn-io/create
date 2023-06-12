import { Screen as FMScreen, ScreenProps, ScreenStates } from '@flexn/create';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '../hooks';

const Screen = ({ children, focusOptions, style, ...rest }: ScreenProps) => {
    const [screenState, setScreenState] = useState<ScreenStates>('foreground');

    useFocusEffect(
        useCallback(() => {
            setScreenState('foreground');

            return () => {
                setScreenState('background');
            };
        }, [])
    );

    return (
        <FMScreen focusOptions={{ ...focusOptions, screenState }} style={style} {...rest}>
            {children}
        </FMScreen>
    );
};

export default Screen;

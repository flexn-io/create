import { Screen as FMScreen, ScreenProps, ScreenStates } from '@flexn/sdk';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';

const Screen = ({ children, stealFocus, focusOptions, style, ...props }: ScreenProps) => {
    const [screenState, setScreenState] = useState<ScreenStates>('foreground');

    useFocusEffect(
        React.useCallback(() => {
            setScreenState('foreground');

            return () => {
                setScreenState('background');
            };
        }, [])
    );

    return (
        <FMScreen
            screenState={screenState}
            stealFocus={stealFocus}
            focusOptions={focusOptions}
            style={style}
            {...props}
        >
            {children}
        </FMScreen>
    );
};

export default Screen;

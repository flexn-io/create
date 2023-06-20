import { Screen as FMScreen, ScreenProps, ScreenStates } from '@flexn/create';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';

const Screen = ({ children, focusOptions, style, ...props }: ScreenProps) => {
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
        <FMScreen focusOptions={{ ...focusOptions, screenState }} style={style} {...props}>
            {children}
        </FMScreen>
    );
};

export default Screen;

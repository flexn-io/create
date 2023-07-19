import React, { useState } from 'react';
import { Screen as FMScreen, ScreenProps, ScreenStates } from '@flexn/create';
import { useFocusEffect } from '@react-navigation/native';
import type { NavigationProps } from '../navigation';
import { TestDescription } from '../components/TestDescription';

type Props = ScreenProps & { route?: NavigationProps['route'] };

const Screen = ({ children, focusOptions, style, route, ...props }: Props) => {
    const { id, description } = route?.params || {};
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
            {id && description && <TestDescription id={id} description={description} />}
            {children}
        </FMScreen>
    );
};

export default Screen;

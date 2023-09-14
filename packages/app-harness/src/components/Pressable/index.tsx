import React from 'react';
import { Pressable, PressableProps } from '@flexn/create';
import { useDebugContext } from '../../context/debugContext';
import { isPlatformAndroid, isPlatformAndroidtv } from '@rnv/renative';

export function testProps(testID: string | undefined) {
    if (!testID) {
        return;
    }
    if (isPlatformAndroid || isPlatformAndroidtv) {
        return { accessibilityLabel: testID, accessible: true };
    }
    return { testID };
}

const PressableEl = (props: PressableProps) => {
    const { setFocusedElementId } = useDebugContext();

    const onFocus = () => {
        if (props.testID) {
            setFocusedElementId(props.testID);
        }
    };

    return <Pressable {...props} onFocus={onFocus} {...testProps(props.testID)} />;
};

export default PressableEl;

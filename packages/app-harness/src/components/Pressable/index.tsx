import React from 'react';
import { Pressable, PressableProps } from '@flexn/create';
import { useDebugContext } from '../../context/debugContext';
import { testProps } from '../../utils';

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

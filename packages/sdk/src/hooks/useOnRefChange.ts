import { useCallback, useEffect, useRef, MutableRefObject } from 'react';
import { AbstractFocusModel } from '../focusManager/types';

export default function useOnRefChange(model: AbstractFocusModel | null): {
    targetRef: MutableRefObject<any>;
    onRefChange: any;
} {
    const targetRef = useRef<MutableRefObject<any>>();

    const onRefChange = useCallback((node) => {
        targetRef.current = node.current ?? node;
    }, []);

    useEffect(() => {
        if (model) {
            model.setNode(targetRef);
        }
    }, [targetRef]);

    return {
        onRefChange,
        targetRef,
    };
}

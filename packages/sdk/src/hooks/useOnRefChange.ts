import { useCallback, useEffect, useRef, MutableRefObject } from 'react';
import FocusModel from '../focusManager/model/FocusModel';

export default function useOnRefChange(model: FocusModel | null): {
    targetRef: MutableRefObject<any>;
    onRefChange: any;
} {
    const targetRef = useRef<MutableRefObject<any>>();

    const onRefChange = useCallback((node) => {
        targetRef.current = node?.current ?? node;
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

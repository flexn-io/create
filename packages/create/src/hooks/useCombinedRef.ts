import { useEffect, MutableRefObject, ForwardedRef, LegacyRef } from 'react';
import FocusModel from '../focusManager/model/FocusModel';
import useOnRefChange from './useOnRefChange';

export function useCombinedRefs<T = undefined>({
    refs,
    model,
}: {
    refs: MutableRefObject<T>[] | ForwardedRef<T>[];
    model: FocusModel | null;
}): MutableRefObject<T> | LegacyRef<T> {
    // const targetRef = useRef<MutableRefObject<T>>();
    const { targetRef } = useOnRefChange(model);
    // const targetRef = useRef<MutableRefObject<any>>();

    useEffect(() => {
        refs.forEach((ref: any) => {
            if (!ref) return;

            if (typeof ref === 'function') {
                ref(targetRef.current);
            } else {
                ref.current = targetRef.current;
            }
        });
    }, [refs]);

    return targetRef;
}

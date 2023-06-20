import { useEffect, MutableRefObject, ForwardedRef } from 'react';
import FocusModel from '../focusManager/model/abstractFocusModel';
import useOnRefChange from './useOnRefChange';

export function useCombinedRefs<T = undefined>({
    refs,
    model,
}: {
    refs: MutableRefObject<T | undefined>[] | ForwardedRef<T | undefined>[];
    model: FocusModel | null;
}): MutableRefObject<T> {
    const { targetRef } = useOnRefChange(model);

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

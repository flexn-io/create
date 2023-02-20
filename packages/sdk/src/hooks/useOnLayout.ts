import { useEffect, useRef } from 'react';
import { InteractionManager } from 'react-native';

export default function useOnLayout(callback: (() => void) | (() => Promise<void>)) {
    const interactionPromise = useRef<Promise<any>>();
    const pendingCallbacks = useRef<{ (): void | Promise<void> }[]>([]).current;

    useEffect(() => {
        interactionPromise.current = InteractionManager.runAfterInteractions(() => {
            if (pendingCallbacks.length) {
                for (let index = 0; index < pendingCallbacks.length; index++) {
                    pendingCallbacks[index]();
                }
                pendingCallbacks.splice(0, pendingCallbacks.length);
            }

            return true;
        }).then(() => Promise.resolve());
    }, []);

    const onLayout = () => {
        if (interactionPromise.current) {
            interactionPromise.current.then(() => {
                callback();
            });
        } else {
            pendingCallbacks.push(callback);
        }
    };

    return {
        onLayout,
    };
};
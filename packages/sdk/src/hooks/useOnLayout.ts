import { useEffect, useRef } from 'react';
import { InteractionManager } from 'react-native';

export default function useOnLayout(callback) {
    const interactionPromise = useRef<Promise<any>>();

    useEffect(() => {
        interactionPromise.current = InteractionManager.runAfterInteractions(() => true).then(() => Promise.resolve());
    }, []);

    const onLayout = () => {
        interactionPromise.current.then(() => {
            callback();
        });
    };

    return {
        onLayout,
    };
};
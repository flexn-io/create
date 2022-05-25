import { DeviceEventEmitter } from 'react-native';
import { useEffect, useRef, useCallback } from 'react';
import throttle from 'lodash.throttle';

function useTVRemoteHandler(callback: any) {
    const listener: any = useRef();

    const handler = useCallback(throttle(callback, 100), []);

    useEffect(() => {
        listener.current = DeviceEventEmitter.addListener('onTVRemoteKey', ({ eventKeyAction, eventType }) => {
            return handler({
                eventType,
                eventKeyAction,
            });
        });

        return () => {
            if (listener.current) listener.current.remove();
        };
    });

    return {};
}

export { useTVRemoteHandler };

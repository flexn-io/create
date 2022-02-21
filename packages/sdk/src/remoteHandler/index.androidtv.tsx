import { DeviceEventEmitter } from 'react-native';
import { useEffect, useRef } from 'react';

function useTVRemoteHandler(callback: any) {
    const listener: any = useRef();

    useEffect(() => {
        listener.current = DeviceEventEmitter.addListener('onTVRemoteKey', ({ eventKeyAction, eventType }) => {
            return callback({
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

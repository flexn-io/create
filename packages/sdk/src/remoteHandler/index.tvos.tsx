import { useEffect, useCallback } from 'react';
import { NativeModules, NativeEventEmitter } from 'react-native';
import throttle from 'lodash.throttle';

const useTVRemoteHandler = (callback: any) => {
    const cb = useCallback(throttle(callback, 100), []);

    useEffect(() => {
        const { TvRemoteHandler } = NativeModules;
        const eventEmitter = new NativeEventEmitter(TvRemoteHandler);
        const executeEvent = (eventData: any) => {
            if (eventData.eventKeyAction === 'down') {
                cb(eventData);
            }
        };

        eventEmitter.addListener('onTVRemoteKey', executeEvent);

        return () => {
            eventEmitter.removeListener('onTVRemoteKey', executeEvent);
        };
    });

    return {};
};
export { useTVRemoteHandler };

import { useEffect, useCallback } from 'react';
import { NativeModules, NativeEventEmitter, EmitterSubscription } from 'react-native';
import throttle from 'lodash.throttle';

const EVENT_NAME = 'onTVRemoteKey';

class TVRemoteHandler {
    __listener: any;
    __eventEmitter = new NativeEventEmitter(NativeModules.TvRemoteHandler);

    enable(component: any, callback: any): void {
        this.__listener = this.__eventEmitter.addListener(EVENT_NAME, (eventData: any) => {
            if (eventData.eventKeyAction === 'down') {
                callback(component, eventData);
            }
        });
    }

    disable(): void {
        if (this.__listener) this.__listener.remove();
    }
}

const useTVRemoteHandler = (callback: any) => {
    const cb = useCallback(throttle(callback, 100), []);

    useEffect(() => {
        const { TvRemoteHandler } = NativeModules;
        const eventEmitter = new NativeEventEmitter(TvRemoteHandler);
        const listener: EmitterSubscription = eventEmitter.addListener(EVENT_NAME, (eventData: any) => {
            if (eventData.eventKeyAction === 'down') {
                cb(eventData);
            }
        });

        return () => {
            if (listener) {
                listener.remove();
            }
        };
    }, [callback]);

    return {};
};
export { useTVRemoteHandler, TVRemoteHandler };

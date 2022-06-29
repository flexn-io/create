import { DeviceEventEmitter, EmitterSubscription } from 'react-native';
import { useEffect, useCallback } from 'react';
import throttle from 'lodash.throttle';

const EVENT_NAME = 'onTVRemoteKey';
class TVRemoteHandler {
    __listener: any;

    enable(component: any, callback: any): void {
        this.__listener = DeviceEventEmitter.addListener(EVENT_NAME, ({ eventKeyAction, eventType }) => {
            return callback(component, {
                eventType,
                eventKeyAction,
            });
        });
    }

    disable(): void {
        if (this.__listener) this.__listener.remove();
    }
}

function useTVRemoteHandler(callback: any) {
    const handler = useCallback(throttle(callback, 100), []);

    useEffect(() => {
        const listener: EmitterSubscription = DeviceEventEmitter.addListener(
            EVENT_NAME,
            ({ eventKeyAction, eventType }) => {
                return handler({
                    eventType,
                    eventKeyAction,
                });
            }
        );

        return () => {
            if (listener) listener.remove();
        };
    }, [callback]);

    return {};
}

export { useTVRemoteHandler, TVRemoteHandler };

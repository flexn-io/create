import { DeviceEventEmitter, EmitterSubscription, Platform } from 'react-native';
import { useEffect, useCallback } from 'react';
import throttle from 'lodash.throttle';

const EVENT_NAME = 'onTVRemoteKey';

export type RemoteHandlerEventKeyActions = 'up' | 'down' | 'longPress';
export type RemoteHandlerEventTypesAndroid =
    | 'left'
    | 'right'
    | 'up'
    | 'down'
    | 'select'
    | 'space'
    | 'playPause'
    | 'back'
    | 'rewind'
    | 'fastForward'
    | 'd'
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | '0';

export type RemoteHandlerCallbackAndroid = (args: {
    eventType: RemoteHandlerEventTypesAndroid;
    eventKeyAction: RemoteHandlerEventKeyActions;
    velocity: number;
}) => void;
export type ClassRemoteHandlerCallbackAndroid = (
    comp: React.Component,
    args: { eventType: RemoteHandlerEventTypesAndroid; eventKeyAction: RemoteHandlerEventKeyActions; velocity: number }
) => void;

class TVRemoteHandler {
    __listener: any;

    enable(component: React.Component, callback: ClassRemoteHandlerCallbackAndroid): void {
        this.__listener = DeviceEventEmitter.addListener(EVENT_NAME, ({ eventKeyAction, eventType }) => {
            return callback(component, {
                eventType,
                eventKeyAction,
                velocity: 0,
            });
        });
    }

    disable(): void {
        if (this.__listener) this.__listener.remove();
    }
}

function useTVRemoteHandler(callback: RemoteHandlerCallbackAndroid) {
    const handler = useCallback(throttle(callback, 100), []);

    useEffect(() => {
        let listener: EmitterSubscription;

        if (Platform.isTV) {
            listener = DeviceEventEmitter.addListener(EVENT_NAME, ({ eventKeyAction, eventType }) => {
                return handler({
                    eventType,
                    eventKeyAction,
                    velocity: 0,
                });
            });
        }

        return () => {
            if (listener) listener.remove();
        };
    }, [callback]);

    return {};
}

export { useTVRemoteHandler, TVRemoteHandler };

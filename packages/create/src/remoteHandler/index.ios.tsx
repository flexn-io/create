import { useEffect, useCallback } from 'react';
import {
    NativeModules,
    NativeEventEmitter,
    EmitterSubscription,
} from 'react-native';
import throttle from 'lodash.throttle';
import { CoreManager } from '..';

const EVENT_NAME = 'onTVRemoteKey';

export type RemoteHandlerEventKeyActions = 'up' | 'down' | 'longPress';
export type RemoteHandlerEventTypesAppleTV =
    | 'swipeDown'
    | 'swipeUp'
    | 'swipeLeft'
    | 'swipeRight'
    | 'left'
    | 'right'
    | 'up'
    | 'down'
    | 'select'
    | 'longSelect'
    | 'menu'
    | 'playPause';

export type RemoteHandlerCallbackAppleTV = (args: {
    eventType: RemoteHandlerEventTypesAppleTV;
    eventKeyAction: RemoteHandlerEventKeyActions;
}) => void;

export type ClassRemoteHandlerCallbackAppleTV = (
    comp: React.Component,
    args: {
        eventType: RemoteHandlerEventTypesAppleTV;
        eventKeyAction: RemoteHandlerEventKeyActions;
        velocity: number;
    }
) => void;

class TVRemoteHandler {
    __listener: any;
    __eventEmitter = new NativeEventEmitter(NativeModules.TvRemoteHandler);

    enable(component: any, callback: ClassRemoteHandlerCallbackAppleTV): void {
        this.__listener = this.__eventEmitter.addListener(
            EVENT_NAME,
            (eventData: {
                eventType: RemoteHandlerEventTypesAppleTV;
                eventKeyAction: RemoteHandlerEventKeyActions;
                velocity: number;
            }) => {
                callback(component, eventData);
            }
        );
    }

    disable(): void {
        if (this.__listener) this.__listener.remove();
    }
}

const useTVRemoteHandler = (callback: RemoteHandlerCallbackAppleTV) => {
    const cb = useCallback(throttle(callback, 100), []);

    useEffect(() => {
        let listener: EmitterSubscription;
        if (CoreManager.isTV()) {
            const { TvRemoteHandler } = NativeModules;
            const eventEmitter = new NativeEventEmitter(TvRemoteHandler);
            listener = eventEmitter.addListener(
                EVENT_NAME,
                (eventData: {
                    eventType: RemoteHandlerEventTypesAppleTV;
                    eventKeyAction: RemoteHandlerEventKeyActions;
                    velocity: number;
                }) => {
                    cb(eventData);
                }
            );
        }

        return () => {
            if (listener) {
                listener.remove();
            }
        };
    }, [callback]);

    return {};
};
export { useTVRemoteHandler, TVRemoteHandler };

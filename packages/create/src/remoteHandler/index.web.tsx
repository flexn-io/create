import { useEffect } from 'react';

export type RemoteHandlerEventKeyActions = 'down';
export type RemoteHandlerEventTypesWebTV = 'left' | 'right' | 'up' | 'down' | 'select' | 'playPause' | 'back';

const EVENT_TYPE_SELECT = 'select';
const EVENT_TYPE_RIGHT = 'right';
const EVENT_TYPE_LEFT = 'left';
const EVENT_TYPE_DOWN = 'down';
const EVENT_TYPE_UP = 'up';
const EVENT_TYPE_PLAY_PAUSE = 'playPause';
const EVENT_TYPE_BACK = 'back';

const DEFAULT_KEY_MAP: { [key: number]: RemoteHandlerEventTypesWebTV } = {
    37: EVENT_TYPE_LEFT,
    38: EVENT_TYPE_UP,
    39: EVENT_TYPE_RIGHT,
    40: EVENT_TYPE_DOWN,
    13: EVENT_TYPE_SELECT,
    32: EVENT_TYPE_PLAY_PAUSE,
    461: EVENT_TYPE_BACK, // webos
    10009: EVENT_TYPE_BACK, // tizen
    27: EVENT_TYPE_BACK, // ESC
};

export type RemoteHandlerCallbackWebTV = (args: {
    eventType: RemoteHandlerEventTypesWebTV;
    eventKeyAction: RemoteHandlerEventKeyActions;
    velocity: number;
}) => void;
export type ClassRemoteHandlerCallbackWebTV = (
    comp: React.Component,
    args: { eventType: RemoteHandlerEventTypesWebTV; eventKeyAction: RemoteHandlerEventKeyActions; velocity: number }
) => void;

class TVRemoteHandler {
    enable(_component: React.Component, _callback: ClassRemoteHandlerCallbackWebTV) {
        //void
    }

    disable() {
        //void
    }
}

const useTVRemoteHandler = (callback: RemoteHandlerCallbackWebTV): void => {
    useEffect(() => {
        const keyUpEventListener = (event: KeyboardEvent) => {
            const eventType = DEFAULT_KEY_MAP[event.keyCode];
            console.log('AHAHAHA');

            callback({ eventType, eventKeyAction: 'down', velocity: 0 });
        };

        window.addEventListener('keyup', keyUpEventListener);

        return () => {
            window.removeEventListener('keyup', keyUpEventListener);
        };
    }, []);
};

export { useTVRemoteHandler, TVRemoteHandler };

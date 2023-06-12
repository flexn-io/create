import { useEffect } from 'react';
import type {
    RemoteHandlerCallbackAndroid,
    ClassRemoteHandlerCallbackAndroid,
    RemoteHandlerEventTypesAndroid,
    RemoteHandlerEventKeyActions,
} from './index.androidtv';
import type {
    RemoteHandlerCallbackAppleTV,
    ClassRemoteHandlerCallbackAppleTV,
    RemoteHandlerEventTypesAppleTV,
} from './index.tvos';

type RemoteHandlerCallback = RemoteHandlerCallbackAndroid & RemoteHandlerCallbackAppleTV;
type ClassRemoteHandlerCallback = ClassRemoteHandlerCallbackAndroid & ClassRemoteHandlerCallbackAppleTV;

class TVRemoteHandler {
    enable(_component: React.Component, _callback: RemoteHandlerCallback) {
        //void
    }

    disable() {
        //void
    }
}

const useTVRemoteHandler = (callback: RemoteHandlerCallback): void => {
    useEffect(() => {
        callback({ velocity: 0, eventKeyAction: 'down', eventType: 'select' });
    }, []);
};

export {
    useTVRemoteHandler,
    TVRemoteHandler,
    ClassRemoteHandlerCallback,
    RemoteHandlerCallback,
    RemoteHandlerEventTypesAndroid,
    RemoteHandlerEventTypesAppleTV,
    RemoteHandlerCallbackAndroid,
    RemoteHandlerCallbackAppleTV,
    ClassRemoteHandlerCallbackAndroid,
    ClassRemoteHandlerCallbackAppleTV,
    RemoteHandlerEventKeyActions,
};

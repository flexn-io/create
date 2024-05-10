import { useEffect } from 'react';
import type {
    RemoteHandlerCallbackAndroid,
    ClassRemoteHandlerCallbackAndroid,
    RemoteHandlerEventTypesAndroid,
    RemoteHandlerEventKeyActions,
} from './index.android';
import type {
    RemoteHandlerCallbackAppleTV,
    ClassRemoteHandlerCallbackAppleTV,
    RemoteHandlerEventTypesAppleTV,
} from './index.ios';
import type {
    RemoteHandlerCallbackWebTV,
    ClassRemoteHandlerCallbackWebTV,
    RemoteHandlerEventTypesWebTV,
} from './index.web';

type RemoteHandlerCallback = RemoteHandlerCallbackAndroid &
    RemoteHandlerCallbackAppleTV &
    RemoteHandlerCallbackWebTV;
type ClassRemoteHandlerCallback = ClassRemoteHandlerCallbackAndroid &
    ClassRemoteHandlerCallbackAppleTV &
    ClassRemoteHandlerCallbackWebTV;

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
    RemoteHandlerCallbackWebTV,
    ClassRemoteHandlerCallbackWebTV,
    RemoteHandlerEventTypesWebTV,
};

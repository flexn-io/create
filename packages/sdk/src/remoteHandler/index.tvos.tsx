import { useEffect } from 'react';

import { NativeModules, NativeEventEmitter } from 'react-native';

const useTVRemoteHandler = (callback: any) => {
    useEffect(() => {
        const { TvRemoteHandler } = NativeModules;
        const eventEmitter = new NativeEventEmitter(TvRemoteHandler);

        const executeEvent = (eventData: any) => {
            callback(eventData);
        };

        eventEmitter.addListener('onTVRemoteKey', executeEvent);

        return () => {
            eventEmitter.removeListener('onTVRemoteKey', executeEvent);
        };
    });

    return {};
};
export { useTVRemoteHandler };

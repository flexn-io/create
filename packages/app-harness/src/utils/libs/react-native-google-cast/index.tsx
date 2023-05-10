import React from 'react';

const noop = () => {
    // do nothing
};

export const GoogleCast = {
    getCastState: noop,
    getDiscoveryManager: noop,
    getSessionManager: noop,
    onCastStateChanged: noop,
    showCastDialog: noop,
    showExpandedControls: noop,
    showIntroductoryOverlay: noop,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useCastChannel = (_channel: string) => {
    return {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        sendMessage: (_message: any) => {
            //
        },
    };
};

export const useCastSession = noop;

export const useMediaStatus = noop;

export const useRemoteMediaClient = noop;

export const CastButton = () => <React.Fragment />;

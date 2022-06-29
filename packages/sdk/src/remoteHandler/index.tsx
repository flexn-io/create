import { useEffect } from 'react';

class TVRemoteHandler {
    enable(_component: any, _callback: any) {
        //void
    }

    disable() {
        //void
    }
}

const useTVRemoteHandler = (callback: any, _component?: any) => {
    useEffect(() => {
        if (!callback) callback();
    });

    return {};
};
export { useTVRemoteHandler, TVRemoteHandler };

import { useEffect } from 'react';

const useTVRemoteHandler = (callback: any) => {
    useEffect(() => {
        if (!callback) callback();
    });

    return {};
};
export { useTVRemoteHandler };

import { useEffect } from 'react';

export default function useOnUnmount(onUnmount: () => void) {
    useEffect(() => {
        return () => onUnmount && onUnmount();
    }, []);
}

import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';

export interface ConfigInterface {
    focusedElementId: string;
    setFocusedElementId: Dispatch<SetStateAction<string>>;
}

export const DebugContext = createContext<ConfigInterface>({
    focusedElementId: '',
    setFocusedElementId: () => {
        // void
    },
});

export function DebugProvider({ children }: { children: any }) {
    const [focusedElementId, setFocusedElementId] = useState('');

    return <DebugContext.Provider value={{ focusedElementId, setFocusedElementId }}>{children}</DebugContext.Provider>;
}

export function useDebugContext() {
    const context = useContext(DebugContext);
    return context;
}

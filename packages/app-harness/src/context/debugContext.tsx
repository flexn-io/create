import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';

export interface ConfigInterface {
    focusedElementId: string;
    additionalTextInfo: string[];
    setFocusedElementId: Dispatch<SetStateAction<string>>;
    setAdditionalTextInfo: Dispatch<SetStateAction<string[]>>;
}

export const DebugContext = createContext<ConfigInterface>({
    focusedElementId: '',
    additionalTextInfo: [],
    setFocusedElementId: () => {
        // void
    },
    setAdditionalTextInfo: () => {
        // void
    },
});

export function DebugProvider({ children }: { children: any }) {
    const [focusedElementId, setFocusedElementId] = useState('');
    const [additionalTextInfo, setAdditionalTextInfo] = useState(['']);

    return (
        <DebugContext.Provider
            value={{ focusedElementId, additionalTextInfo, setFocusedElementId, setAdditionalTextInfo }}
        >
            {children}
        </DebugContext.Provider>
    );
}

export function useDebugContext() {
    const context = useContext(DebugContext);
    return context;
}

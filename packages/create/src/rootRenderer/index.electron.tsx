import React, { FC } from 'react';
import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container!);

export const renderApp = (App: FC<any>, _options?: { enableWarnings: boolean }) => {
    root.render(<App />);
};

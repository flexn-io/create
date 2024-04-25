import '../webospolyfills';

import React, { FC } from 'react';
import ReactDOM from 'react-dom';

export const renderApp = (App: FC<any>, _options?: { enableWarnings: boolean }) => {
    ReactDOM.render(React.createElement(App), document.getElementById('root'));
};

declare module '*.png';
declare module '*.jpg';

import 'react-native';
import 'recyclerlistview';

declare module 'react-native' {
    export const TVMenuControl: {
        enableTVMenuKey(): void;
        disableTVMenuKey(): void;
    };
}

declare module 'recyclerlistview' {}

export default {};

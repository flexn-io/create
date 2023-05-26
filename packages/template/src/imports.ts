import { Dimensions } from 'react-native';
import { isPlatformAndroidtv } from '@rnv/renative';
export const getWidth = () => {
    return Dimensions.get('window').width * (isPlatformAndroidtv ? 2 : 1);
};

// export {
//     isPlatformIos,
//     isPlatformMacos,
//     isPlatformTvos,
//     isPlatformWeb,
//     isFactorMobile,
//     isPlatformTizen,
//     isPlatformWebos,
// } from '@rnv/renative';

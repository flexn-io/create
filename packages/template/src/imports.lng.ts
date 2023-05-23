import { LAYOUT } from './config';

const isPlatformIos = false;
const isPlatformMacos = false;
const isPlatformTvos = false;
const isPlatformWeb = false;
const isFactorMobile = false;
const isPlatformTizen = true;
const isPlatformWebos = true;

export const getWidth = () => {
    return LAYOUT.w;
};

export {
    isPlatformIos,
    isPlatformMacos,
    isPlatformTvos,
    isPlatformWeb,
    isFactorMobile,
    isPlatformTizen,
    isPlatformWebos,
};

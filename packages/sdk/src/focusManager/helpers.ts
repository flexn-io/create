import React, { useRef, useEffect } from 'react';
import { Dimensions, PixelRatio } from 'react-native';
import { isPlatformAndroidtv, isPlatformFiretv } from 'renative';
import { ForbiddenFocusDirections } from './types';

export const getPaddingsValues = (style: any) => {
    const paddings = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    };

    if (style) {
        const s = typeof style === 'object' && !Array.isArray(style) ? [style] : style;

        s.forEach((current: any) => {
            paddings.top += current.paddingTop || 0 + current.paddingVertical || 0;
            paddings.bottom += current.paddingBottom || 0 + current.paddingVertical || 0;
            paddings.left += current.paddingLeft || 0 + current.paddingHorizontal || 0;
            paddings.right += current.paddingRight || 0 + current.paddingHorizontal || 0;
        });
    }

    return paddings;
};

export const mergeStyles = (s1: any, s2?: any) => {
    const _s1 = Array.isArray(s1) ? s1.filter((v) => v) : null;
    const _s2 = Array.isArray(s2) ? s2.filter((v) => v) : null;

    if (_s1 && !_s2) {
        return _s1;
    }
    if (!_s1 && _s2) {
        return _s2;
    }
    if (!_s1 && !_s2) {
        return [];
    }
    const s1Temp = typeof _s1 === 'object' && !Array.isArray(_s1) ? [_s1] : _s1;
    const s2Temp = typeof _s2 === 'object' && !Array.isArray(_s2) ? [_s2] : _s2;

    return [...s1Temp, ...s2Temp];
};

export function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function alterForbiddenFocusDirections(forbiddenFocusDirections: ForbiddenFocusDirections[] = []) {
    const ffd: string[] = [...forbiddenFocusDirections];

    forbiddenFocusDirections.forEach((direction) => {
        if (direction === 'down') ffd.push('swipeDown');
        if (direction === 'up') ffd.push('swipeUp');
        if (direction === 'left') ffd.push('swipeLeft');
        if (direction === 'right') ffd.push('swipeRight');
    });

    return ffd;
}

export function useCombinedRefs(...refs: any) {
    const targetRef = React.useRef<any | null>(null);

    React.useEffect(() => {
        refs.forEach((ref: any) => {
            if (!ref) return;

            if (typeof ref === 'function') {
                ref(targetRef.current);
            } else {
                ref.current = targetRef.current; //eslint-disable-line
            }
        });
    }, [refs]);

    return targetRef;
}

export function usePrevious(value: any) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export function Ratio(pixels: number): number {
    if (!(isPlatformAndroidtv || isPlatformFiretv)) return pixels;
    const resolution = Dimensions.get('screen').height * PixelRatio.get();

    return Math.round(pixels / (resolution < 2160 ? 2 : 1));
}

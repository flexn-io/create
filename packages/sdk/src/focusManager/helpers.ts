import React, { useRef, useEffect } from 'react';
import { Dimensions, PixelRatio } from 'react-native';
import { isPlatformAndroidtv, isPlatformFiretv } from '@rnv/renative';
import { ForbiddenFocusDirections } from './types';
import type { Context } from './types';
import { DIRECTION_UP, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT, SCREEN_STATES } from './constants';
import AbstractFocusModel from './Model/AbstractFocusModel';

export function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function flattenStyle(style: any) {
    let flattenedStyle: any = {};
    if (Array.isArray(style)) {
        style.map((item) => {
            item && Object.keys(item) && Object.keys(item).map((key) => (flattenedStyle[key] = item[key]));
        });
    } else {
        flattenedStyle = style || {};
    }

    return { ...flattenedStyle };
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

function pickActiveForcedFocusContext(
    nextForcedFocusKey: string | string[],
    focusMap: { [key: string]: AbstractFocusModel }
): string | null {
    if (Array.isArray(nextForcedFocusKey)) {
        for (let index = 0; index < nextForcedFocusKey.length; index++) {
            const focusKey = nextForcedFocusKey[index];
            const isActive: AbstractFocusModel | undefined = Object.values(focusMap).find(
                (s) =>
                    s.focusKey === focusKey &&
                    (s?.screen?.state === SCREEN_STATES.FOREGROUND || s.state === SCREEN_STATES.FOREGROUND)
            );
            if (isActive) {
                return focusKey;
            }
        }
        return null;
    }

    const isActive = Object.values(focusMap).find(
        (s) =>
            s.focusKey === nextForcedFocusKey &&
            (s?.screen?.state === SCREEN_STATES.FOREGROUND || s.state === SCREEN_STATES.FOREGROUND)
    );

    return isActive ? nextForcedFocusKey : null;
}
export function getNextForcedFocusKey(
    cls: AbstractFocusModel,
    direction: string,
    focusMap: { [key: string]: AbstractFocusModel }
): string | null {
    if (cls.nextFocusLeft && DIRECTION_LEFT.includes(direction)) {
        return pickActiveForcedFocusContext(cls.nextFocusLeft, focusMap);
    }
    if (cls.nextFocusRight && DIRECTION_RIGHT.includes(direction)) {
        return pickActiveForcedFocusContext(cls.nextFocusRight, focusMap);
    }
    if (cls.nextFocusUp && DIRECTION_UP.includes(direction)) {
        return pickActiveForcedFocusContext(cls.nextFocusUp, focusMap);
    }
    if (cls.nextFocusDown && DIRECTION_DOWN.includes(direction)) {
        return pickActiveForcedFocusContext(cls.nextFocusDown, focusMap);
    }

    return null;
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

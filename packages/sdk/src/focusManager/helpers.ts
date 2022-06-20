import React, { useRef, useEffect } from 'react';
import { ForbiddenFocusDirections } from './types';
import { DIRECTION_UP, DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT } from './constants';
import AbstractFocusModel from './model/AbstractFocusModel';

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

export function getDirectionName(direction: string) {
    switch (direction) {
        case 'swipeLeft':
        case 'left': 
            return 'left';
        case 'swipeRight':
        case 'right':
            return 'right';
        case 'swipeUp':
        case 'up':
            return 'up';
        case 'swipeDown':
        case 'down':
            return 'down';
        default:
            return direction;
    }
}
export function alterForbiddenFocusDirections(
    forbiddenFocusDirections: ForbiddenFocusDirections[] = []
): ForbiddenFocusDirections[] {
    const ffd: ForbiddenFocusDirections[] = [...forbiddenFocusDirections];

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
                (cls) => cls.getFocusKey() === focusKey && cls.isInForeground()
            );
            if (isActive) {
                return focusKey;
            }
        }
        return null;
    }
    const isActive = Object.values(focusMap).find(
        (cls) => cls.getFocusKey() === nextForcedFocusKey && cls.isInForeground()
    );
    return isActive ? nextForcedFocusKey : null;
}
export function getNextForcedFocusKey(
    cls: AbstractFocusModel,
    direction: string,
    focusMap: { [key: string]: AbstractFocusModel }
): string | null {
    if (cls.getNextFocusLeft() && DIRECTION_LEFT.includes(direction)) {
        return pickActiveForcedFocusContext(cls.getNextFocusLeft(), focusMap);
    }
    if (cls.getNextFocusRight() && DIRECTION_RIGHT.includes(direction)) {
        return pickActiveForcedFocusContext(cls.getNextFocusRight(), focusMap);
    }
    if (cls.getNextFocusUp() && DIRECTION_UP.includes(direction)) {
        return pickActiveForcedFocusContext(cls.getNextFocusUp(), focusMap);
    }
    if (cls.getNextFocusDown() && DIRECTION_DOWN.includes(direction)) {
        return pickActiveForcedFocusContext(cls.getNextFocusDown(), focusMap);
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

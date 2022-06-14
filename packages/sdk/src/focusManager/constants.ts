import { getScaledValue } from '@rnv/renative';
import { ScreenStates } from './types';
import { Ratio } from '../helpers';

const BACKGROUND: ScreenStates = 'background';
const FOREGROUND: ScreenStates = 'foreground';

export const SCREEN_STATES = {
    BACKGROUND,
    FOREGROUND,
};

export const CONTEXT_TYPES = {
    SCREEN: 'screen',
    VIEW: 'view',
    RECYCLER: 'recycler',
};

export const WINDOW_ALIGNMENT = {
    BOTH_EDGE: 'both-edge',
    LOW_EDGE: 'low-edge'
};

export const defaultAnimation = {
    type: 'scale',
    scale: 1.1,
};

export const DIRECTION_HORIZONTAL = ['left', 'swipeLeft', 'right', 'swipeRight'];
export const DIRECTION_VERTICAL = ['up', 'swipeUp', 'down', 'swipeDown'];
export const DIRECTION_UP = ['up', 'swipeUp'];
export const DIRECTION_DOWN = ['down', 'swipeDown'];
export const DIRECTION_RIGHT = ['right', 'swipeRight'];
export const DIRECTION_LEFT = ['left', 'swipeLeft'];
export const DIRECTION = [...DIRECTION_HORIZONTAL, ...DIRECTION_VERTICAL];

export const FOCUS_PADDING = getScaledValue(100);
export const DEFAULT_VIEWPORT_OFFSET = Ratio(70);
export const CUTOFF_SIZE = getScaledValue(400);

export const ANIMATIONS = {
    BORDER: 'border',
    SCALE: 'scale',
    SCALE_BORDER: 'scale_with_border',
    BACKGROUND: 'background',
};

export const ANIMATION_TYPES = {
    BORDER: 'border',
    SCALE: 'scale',
    SCALE_BORDER: 'scale_with_border',
    BACKGROUND: 'background',
};
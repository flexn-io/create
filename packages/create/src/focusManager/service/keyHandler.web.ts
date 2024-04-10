import throttle from 'lodash.throttle';
import CoreManager from './core';
import { DIRECTIONS } from '../constants';
import { FocusDirection } from '../types';

const EVENT_TYPE_SELECT = 'select';
const EVENT_TYPE_RIGHT = 'right';
const EVENT_TYPE_LEFT = 'left';
const EVENT_TYPE_DOWN = 'down';
const EVENT_TYPE_UP = 'up';
const EVENT_TYPE_PLAY_PAUSE = 'playPause';
const EVENT_TYPE_BACK = 'back';
const LONG_PRESS_TIMEOUT_MS = 200;
const EVENT_KEY_ACTION_LONG_PRESS = 'longPress';

const DEFAULT_KEY_MAP: any = {
    37: EVENT_TYPE_LEFT,
    38: EVENT_TYPE_UP,
    39: EVENT_TYPE_RIGHT,
    40: EVENT_TYPE_DOWN,
    13: EVENT_TYPE_SELECT,
    32: EVENT_TYPE_PLAY_PAUSE,
    461: EVENT_TYPE_BACK, // webos
    10009: EVENT_TYPE_BACK, // tizen
    27: EVENT_TYPE_BACK, // ESC
};

class KeyHandler {
    private keyDownEventListener?: (event: KeyboardEvent) => void;
    private keyUpEventListener?: (event: KeyboardEvent) => void;
    private longPressTimeout?: NodeJS.Timeout | null;

    constructor() {
        this.onKeyDown = throttle(this.onKeyDown.bind(this), 200);
        this.enableKeyHandler = this.enableKeyHandler.bind(this);

        this.enableKeyHandler();
    }

    private enableKeyHandler() {
        this.keyDownEventListener = (event: KeyboardEvent) => {
            const eventType = DEFAULT_KEY_MAP[event.keyCode];

            if (eventType === EVENT_TYPE_SELECT) {
                if (event.repeat) return;
                this.longPressTimeout = setTimeout(() => {
                    this.onKeyDown(EVENT_KEY_ACTION_LONG_PRESS);
                    this.longPressTimeout = null;
                    clearTimeout(this.longPressTimeout!);
                }, LONG_PRESS_TIMEOUT_MS);
            } else {
                this.onKeyDown(eventType);
            }
        };
        this.keyUpEventListener = (event: KeyboardEvent) => {
            const eventType = DEFAULT_KEY_MAP[event.keyCode];

            if (eventType === EVENT_TYPE_SELECT) {
                if (this.longPressTimeout) {
                    clearTimeout(this.longPressTimeout);
                    this.longPressTimeout = null;
                    this.onKeyDown(EVENT_TYPE_SELECT);
                }
            }
        };

        window.addEventListener('keydown', this.keyDownEventListener);
        window.addEventListener('keyup', this.keyUpEventListener);
    }

    public removeListeners() {
        if (this.keyDownEventListener) {
            window.removeEventListener('keydown', this.keyDownEventListener);
        }
        if (this.keyUpEventListener) {
            window.removeEventListener('keyup', this.keyUpEventListener);
        }
    }

    private onKeyDown(eventType: string) {
        const isFocusAndKeyEventsEnabled =
            CoreManager.isFocusManagerEnabled() &&
            CoreManager.isKeyEventsEnabled();
        const isFocusReady =
            CoreManager.getCurrentFocus() &&
            CoreManager.getCurrentFocus()?.getScreen()?.isInForeground() &&
            !CoreManager.getCurrentFocus()
                ?.getScreen()
                ?.isInitialLoadInProgress();

        if (isFocusAndKeyEventsEnabled && isFocusReady) {
            if (eventType === EVENT_TYPE_SELECT) {
                CoreManager.getCurrentFocus()?.onPress();
            }

            if (eventType === EVENT_KEY_ACTION_LONG_PRESS) {
                CoreManager.getCurrentFocus()?.onLongPress();
            }

            const direction = this.getDirectionName(eventType);
            if (direction) {
                CoreManager.executeDirectionalFocus(direction);
                CoreManager.executeScroll(direction);
            }
        }
    }

    public getDirectionName(direction: string): FocusDirection | null {
        switch (direction) {
            case 'swipeLeft':
            case 'left':
                return DIRECTIONS.LEFT;
            case 'swipeRight':
            case 'right':
                return DIRECTIONS.RIGHT;
            case 'swipeUp':
            case 'up':
                return DIRECTIONS.UP;
            case 'swipeDown':
            case 'down':
                return DIRECTIONS.DOWN;
            default:
                return null;
        }
    }
}

export default KeyHandler;

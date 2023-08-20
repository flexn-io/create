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
    private keyUpEventListener?: (event: KeyboardEvent) => void;

    constructor() {
        this.onKeyDown = throttle(this.onKeyDown.bind(this), 200);
        this.enableKeyHandler = this.enableKeyHandler.bind(this);

        this.enableKeyHandler();
    }

    private enableKeyHandler() {
        this.keyUpEventListener = (event: KeyboardEvent) => {
            const eventType = DEFAULT_KEY_MAP[event.keyCode];

            this.onKeyDown(eventType);
        };

        window.addEventListener('keydown', this.keyUpEventListener);
    }

    public removeListeners() {
        if (this.keyUpEventListener) {
            window.removeEventListener('keydown', this.keyUpEventListener);
        }
    }

    private onKeyDown(eventType: string) {
        const isFocusAndKeyEventsEnabled = CoreManager.isFocusManagerEnabled() && CoreManager.isKeyEventsEnabled();
        const isFocusReady =
            CoreManager.getCurrentFocus() &&
            CoreManager.getCurrentFocus()?.getScreen()?.isInForeground() &&
            !CoreManager.getCurrentFocus()?.getScreen()?.isInitialLoadInProgress();

        if (isFocusAndKeyEventsEnabled && isFocusReady) {
            if (eventType === EVENT_TYPE_SELECT) {
                CoreManager.getCurrentFocus()?.onPress();
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

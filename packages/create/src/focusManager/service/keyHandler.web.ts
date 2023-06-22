import CoreManager from './core';
import { DIRECTIONS } from '../constants';
import Logger from './logger';
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
        this.onKeyDown = this.onKeyDown.bind(this);
        this.enableKeyHandler = this.enableKeyHandler.bind(this);

        this.enableKeyHandler();
    }

    private enableKeyHandler() {
        this.keyUpEventListener = (event: KeyboardEvent) => {
            const eventType = DEFAULT_KEY_MAP[event.keyCode];

            this.onKeyDown(eventType);
        };

        window.addEventListener('keyup', this.keyUpEventListener);
    }

    public removeListeners() {
        if (this.keyUpEventListener) {
            window.removeEventListener('keyup', this.keyUpEventListener);
        }
    }

    private onKeyDown(eventType: string) {
        if (CoreManager.isFocusManagerEnabled()) {
            if (eventType === EVENT_TYPE_SELECT && CoreManager.getCurrentFocus()) {
                CoreManager.getCurrentFocus()?.onPress();
            }

            if (CoreManager.getCurrentFocus()) {
                const direction = this.getDirectionName(eventType);
                if (direction) {
                    CoreManager.executeDirectionalFocus(direction);
                    CoreManager.executeScroll(direction);
                }
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

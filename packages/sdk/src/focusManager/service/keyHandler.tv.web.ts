import CoreManager from './core';
import { DIRECTION } from '../constants';
import Logger from './logger';

const EVENT_TYPE_SELECT = 'select';
const EVENT_TYPE_RIGHT = 'right';
const EVENT_TYPE_LEFT = 'left';
const EVENT_TYPE_DOWN = 'down';
const EVENT_TYPE_UP = 'up';
const EVENT_TYPE_PLAY_PAUSE = 'playPause';

const DEFAULT_KEY_MAP: any = {
    37: EVENT_TYPE_LEFT,
    38: EVENT_TYPE_UP,
    39: EVENT_TYPE_RIGHT,
    40: EVENT_TYPE_DOWN,
    13: EVENT_TYPE_SELECT,
    32: EVENT_TYPE_PLAY_PAUSE,
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
        // to be implemented
    };

    private onKeyDown(eventType: string) {
        if (eventType === 'playPause') {
            Logger.getInstance().debug(CoreManager);
            CoreManager.debuggerEnabled = !CoreManager.isDebuggerEnabled;
        }

        if (eventType === EVENT_TYPE_SELECT && CoreManager.getCurrentFocus()) {
            CoreManager.getCurrentFocus()?.onPress();
        }

        if (CoreManager.getCurrentFocus()) {
            if (CoreManager.hasPendingUpdateGuideLines) {
                CoreManager.executeUpdateGuideLines();
            }

            if (DIRECTION.includes(eventType)) {
                CoreManager.executeDirectionalFocus(eventType);
                CoreManager.executeScroll(eventType);
                CoreManager.executeUpdateGuideLines();
            }
        }
    }
}

export default KeyHandler;

import { isPlatformAndroidtv, isPlatformFiretv } from '@rnv/renative';
import throttle from 'lodash.throttle';
import CoreManager from './core';
import { DIRECTION } from '../constants';
import Logger from './logger';

const EVENT_TYPE_SELECT = 'select';
const EVENT_TYPE_RIGHT = 'right';
const EVENT_TYPE_LEFT = 'left';
const EVENT_TYPE_DOWN = 'down';
const EVENT_TYPE_UP = 'up';

const IS_ANDROID_BASED = isPlatformAndroidtv || isPlatformFiretv;

class KeyHandler {

    private _stopKeyDownEvents: boolean;

    constructor() {
        this._stopKeyDownEvents = false;


        this.onKeyDown = throttle(this.onKeyDown.bind(this), 100);
        this.enableKeyHandler = this.enableKeyHandler.bind(this);

        this.enableKeyHandler();
    }

    private enableKeyHandler() {

    }
    
    private onKeyDown(eventType: string) {
        if (eventType === 'playPause') {
            Logger.getInstance().debug(CoreManager);
            CoreManager.debuggerEnabled = !CoreManager.isDebuggerEnabled;
        }

        if (!this._stopKeyDownEvents) {
            if (IS_ANDROID_BASED && eventType === EVENT_TYPE_SELECT && CoreManager.getCurrentFocus()) {
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
}

export default KeyHandler;

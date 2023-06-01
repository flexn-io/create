import { NativeModules, NativeEventEmitter, DeviceEventEmitter } from 'react-native';
import { isPlatformAndroidtv, isPlatformTvos, isPlatformFiretv } from '@rnv/renative';
import throttle from 'lodash.throttle';
import CoreManager from './core';
import { DIRECTION } from '../constants';
import Grid from '../model/grid';
import RecyclerView from '../model/recycler';
import Row from '../model/row';
import List from '../model/list';

const EVENT_KEY_ACTION_UP = 'up';
const EVENT_KEY_ACTION_DOWN = 'down';
const EVENT_KEY_ACTION_LONG_PRESS = 'longPress';

const INTERVAL_TIME_MS = 100;
const INTERVAL_TIME_MS_GRID = 200;

const EVENT_TYPE_SELECT = 'select';
export const EVENT_TYPE_D = 'd';

const IS_ANDROID_BASED = isPlatformAndroidtv || isPlatformFiretv;

class KeyHandler {
    private eventEmitter: any;

    private _longPressInterval: any;
    private _stopKeyDownEvents: boolean;

    constructor() {
        this._stopKeyDownEvents = false;
        this._longPressInterval = 0;

        const { TvRemoteHandler } = NativeModules;

        if (isPlatformTvos) {
            this.eventEmitter = new NativeEventEmitter(TvRemoteHandler);
        } else {
            this.eventEmitter = DeviceEventEmitter;
        }

        this.onKeyDown = throttle(this.onKeyDown.bind(this), 100);
        this.onKeyLongPress = this.onKeyLongPress.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.handleKeyEvent = this.handleKeyEvent.bind(this);
        this.enableKeyHandler = this.enableKeyHandler.bind(this);

        this.enableKeyHandler();
    }

    public removeListeners() {
        if (isPlatformTvos) {
            this.eventEmitter.removeListener('onTVRemoteKey', this.handleKeyEvent);
        }
        if (IS_ANDROID_BASED) {
            this.eventEmitter.remove();
        }
    }

    private enableKeyHandler() {
        if (isPlatformTvos) {
            this.eventEmitter.addListener('onTVRemoteKey', this.handleKeyEvent);
        } else {
            this.eventEmitter = DeviceEventEmitter.addListener('onTVRemoteKey', this.handleKeyEvent);
        }
    }

    private handleKeyEvent({ eventKeyAction, eventType }: { eventKeyAction: string; eventType: string }) {
        switch (eventKeyAction) {
            case EVENT_KEY_ACTION_UP:
                return this.onKeyUp();
            case EVENT_KEY_ACTION_DOWN:
                return this.onKeyDown(eventType);
            case EVENT_KEY_ACTION_LONG_PRESS:
                return this.onKeyLongPress(eventType);
            default:
                break;
        }
    }

    private onKeyDown(eventType: string) {
        if (!this._stopKeyDownEvents) {
            if (
                eventType === EVENT_TYPE_SELECT &&
                CoreManager.getCurrentFocus() &&
                CoreManager.getCurrentFocus()?.getScreen()?.isInForeground()
            ) {
                CoreManager.getCurrentFocus()?.onPress();
            }

            if (CoreManager.getCurrentFocus()) {
                if (DIRECTION.includes(eventType)) {
                    CoreManager.executeDirectionalFocus(eventType);
                    CoreManager.executeScroll(eventType);
                }
            }
        }
    }

    private onKeyLongPress(eventType: string) {
        if (this.isInRecycler() && DIRECTION.includes(eventType)) {
            this._stopKeyDownEvents = true;
            this._longPressInterval = setInterval(
                () => {
                    const selectedIndex = this.getSelectedIndex();

                    CoreManager.executeDirectionalFocus(eventType);
                    CoreManager.executeScroll(eventType);

                    if (selectedIndex === 0 || selectedIndex === this.getMaxIndex()) {
                        this.onKeyUp();
                    }
                },
                CoreManager.getCurrentFocus()?.getParent() instanceof Grid ? INTERVAL_TIME_MS_GRID : INTERVAL_TIME_MS
            );
        }
    }

    private onKeyUp() {
        if (this._longPressInterval) {
            clearInterval(this._longPressInterval);
            this._stopKeyDownEvents = false;
        }
    }

    private getSelectedIndex(): number {
        const currentFocus = CoreManager.getCurrentFocus();

        if (currentFocus) {
            return currentFocus.getRepeatContext()?.index || 0;
        }

        return 0;
    }

    private getMaxIndex(): number {
        const parent = CoreManager.getCurrentFocus()?.getParent();
        const isRecyclable =
            parent instanceof RecyclerView || parent instanceof Row || parent instanceof Grid || parent instanceof List;

        if (parent && isRecyclable) {
            return parent.getLayouts().length;
        }

        return 0;
    }

    private isInRecycler(): boolean {
        const parent = CoreManager.getCurrentFocus()?.getParent();

        return parent instanceof RecyclerView ||
            parent instanceof Row ||
            parent instanceof Grid ||
            parent instanceof List
            ? true
            : false;
    }
}

export default KeyHandler;

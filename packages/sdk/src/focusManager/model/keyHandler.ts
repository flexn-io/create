import { TVEventHandler, NativeModules, NativeEventEmitter, DeviceEventEmitter } from 'react-native';
import { isPlatformAndroidtv, isPlatformTvos, isPlatformFiretv } from '@rnv/renative';
import throttle from 'lodash.throttle';
import CoreManager from './core';
import { DIRECTION } from '../constants';

const EVENT_KEY_ACTION_UP = 'up';
const EVENT_KEY_ACTION_DOWN = 'down';
const EVENT_KEY_ACTION_LONG_PRESS = 'longPress';

const INTERVAL_TIME_MS = 100;
const SCROLL_INDEX_INTERVAL = 3;

const EVENT_TYPE_SELECT = 'select';
const EVENT_TYPE_RIGHT = 'right';
const EVENT_TYPE_LEFT = 'left';

const IS_ANDROID_BASED = isPlatformAndroidtv || isPlatformFiretv;

class KeyHandler {
    private selectHandler: any;
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

        this.selectHandler = new TVEventHandler();

        this.onKeyDown = throttle(this.onKeyDown.bind(this), 100);
        this.onKeyLongPress = this.onKeyLongPress.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.handleKeyEvent = this.handleKeyEvent.bind(this);
        this.enableKeyHandler = this.enableKeyHandler.bind(this);

        this.enableKeyHandler();
        this.enableSelectHandler();
    }

    public removeListeners() {
        if (isPlatformTvos) {
            this.eventEmitter.removeListener('onTVRemoteKey', this.handleKeyEvent);
        }
        if (IS_ANDROID_BASED) {
            this.eventEmitter.remove();
        }
    }

    private enableKeyHandler()  {
        if (isPlatformTvos) {
            this.eventEmitter.addListener('onTVRemoteKey', this.handleKeyEvent);
        } else {
            this.eventEmitter = DeviceEventEmitter.addListener('onTVRemoteKey', this.handleKeyEvent);
        }
    }

    private enableSelectHandler() {
        this.selectHandler.enable(null, (_: any, evt: any) => {
            const direction = evt.eventType;
            if (isPlatformTvos) {
                if (direction === 'playPause') {
                    console.log(CoreManager);
                    CoreManager.debuggerEnabled = !CoreManager.isDebuggerEnabled;
                }

                if (direction === 'select') {
                    // This can happen if we opened new screen which doesn't have any focusable
                    // then last screen in context map still keeping focus
                    const currentFocus = CoreManager.getCurrentFocus();
                    if (currentFocus && currentFocus?.getScreen()?.isInForeground()) {
                        currentFocus.onPress();
                    }
                }
            }
        });
    }

    private handleKeyEvent({ eventKeyAction, eventType }: { eventKeyAction: string, eventType: string }) {
        switch (eventKeyAction) {
            case EVENT_KEY_ACTION_UP:
                return this.onKeyUp(eventType);
            case EVENT_KEY_ACTION_DOWN:
                return this.onKeyDown(eventType);
            case EVENT_KEY_ACTION_LONG_PRESS:
                return this.onKeyLongPress(eventType);
            default:
                break;
        }
    }

    private onKeyDown(eventType: string) {
        if (eventType === 'playPause') {
            // console.log(CoreManager);
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
    
    private onKeyLongPress(eventType: string) {
        if (this.isInRecycler()) {
            this._stopKeyDownEvents = true;
        
            let selectedIndex = this.getSelectedIndex();
            this._longPressInterval = setInterval(() => {    
                if (EVENT_TYPE_RIGHT === eventType) {
                    selectedIndex += SCROLL_INDEX_INTERVAL;
                    if (selectedIndex > this.getMaxIndex()) selectedIndex = this.getMaxIndex();
                }
                if (EVENT_TYPE_LEFT === eventType) {
                    selectedIndex -= SCROLL_INDEX_INTERVAL;
                    if (selectedIndex < 0) selectedIndex = 0;
                }

                CoreManager.executeInlineFocus(selectedIndex);
                CoreManager.executeUpdateGuideLines();

                if (selectedIndex === 0 || selectedIndex === this.getMaxIndex()) {
                    clearInterval(this._longPressInterval);
                    this._stopKeyDownEvents = false;
                }
    
            }, INTERVAL_TIME_MS);
        }
    }

    private onKeyUp(eventType: string) {
        this._stopKeyDownEvents = false;
        if (this._longPressInterval) {
            clearInterval(this._longPressInterval);
            this._longPressInterval = 0;
            setTimeout(() => {
                this.onKeyDown(eventType);
            }, 100);
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
        if (parent) {
            return parent.getLayouts().length;
        }

        return 0;
    };

    private isInRecycler(): boolean {
        const parent = CoreManager.getCurrentFocus()?.getParent();
        
        return parent?.isRecyclable() ? true : false;
    }
};

export default KeyHandler;
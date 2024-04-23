import { NativeModules, NativeEventEmitter, DeviceEventEmitter, EmitterSubscription, Platform } from 'react-native';
import throttle from 'lodash.throttle';
import {
    RemoteHandlerEventTypesAppleTV,
    RemoteHandlerEventTypesAndroid,
    RemoteHandlerEventKeyActions,
} from '../../remoteHandler';
import CoreManager from './core';
import { DIRECTIONS } from '../constants';
import Grid from '../model/grid';
import RecyclerView from '../model/recycler';
import Row from '../model/row';
import { FocusDirection } from '../types';

const EVENT_KEY_ACTION_UP = 'up';
const EVENT_KEY_ACTION_DOWN = 'down';
const EVENT_KEY_ACTION_LONG_PRESS = 'longPress';

const LONG_PRESS_INTERVAL_TIME_MS = 80;
const LONG_PRESS_INTERVAL_TIME_MS_GRID = 100;

const EVENT_TYPE_SELECT = 'select';
const EVENT_TYPE_LONG_SELECT = 'longSelect';
export const EVENT_TYPE_D = 'd';

class KeyHandler {
    private eventEmitter: EmitterSubscription;

    private _longPressInterval: any;
    private _animatingInterval: any;
    private _stopKeyDownEvents: boolean;

    constructor() {
        this._stopKeyDownEvents = false;
        this._longPressInterval = 0;
        this._animatingInterval = 0;

        this.onKeyDown = throttle(this.onKeyDown.bind(this), 100);
        this.onKeyLongPress = this.onKeyLongPress.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.handleKeyEvent = this.handleKeyEvent.bind(this);
        this.handleKeyEventAndroid = this.handleKeyEventAndroid.bind(this);

        if (CoreManager.isTV() && Platform.OS === 'ios') {
            const { TvRemoteHandler } = NativeModules;
            this.eventEmitter = new NativeEventEmitter(TvRemoteHandler).addListener(
                'onTVRemoteKey',
                this.handleKeyEvent
            );
        } else {
            this.eventEmitter = DeviceEventEmitter.addListener('onTVRemoteKey', this.handleKeyEventAndroid);
        }
    }

    public removeListeners() {
        this.eventEmitter?.remove();
    }

    private handleKeyEvent({
        eventKeyAction,
        eventType,
    }: {
        eventKeyAction: RemoteHandlerEventKeyActions;
        eventType: RemoteHandlerEventTypesAppleTV | RemoteHandlerEventTypesAndroid;
    }) {
        const isFocusAndKeyEventsEnabled = CoreManager.isFocusManagerEnabled() && CoreManager.isKeyEventsEnabled();
        const isFocusReady =
            CoreManager.getCurrentFocus() &&
            CoreManager.getCurrentFocus()?.getScreen()?.isInForeground() &&
            !CoreManager.getCurrentFocus()?.getScreen()?.isInitialLoadInProgress();

        if (isFocusAndKeyEventsEnabled && isFocusReady) {
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
    }

    private handleKeyEventAndroid({
        eventKeyAction,
        eventType,
    }: {
        eventKeyAction: RemoteHandlerEventKeyActions;
        eventType: RemoteHandlerEventTypesAppleTV | RemoteHandlerEventTypesAndroid;
    }) {
        const isFocusAndKeyEventsEnabled = CoreManager.isFocusManagerEnabled() && CoreManager.isKeyEventsEnabled();
        const isFocusReady =
            CoreManager.getCurrentFocus() &&
            CoreManager.getCurrentFocus()?.getScreen()?.isInForeground() &&
            !CoreManager.getCurrentFocus()?.getScreen()?.isInitialLoadInProgress();

        if (isFocusAndKeyEventsEnabled && isFocusReady) {
            switch (eventKeyAction) {
                case EVENT_KEY_ACTION_UP:
                    if (eventType === EVENT_TYPE_SELECT) {
                        return this.onKeyDown('select');
                    } else {
                        return this.onKeyUp(eventType);
                    }
                case EVENT_KEY_ACTION_DOWN:
                    return this.onKeyDown(eventType);
                case EVENT_KEY_ACTION_LONG_PRESS:
                    return this.onKeyLongPress(eventType);
                default:
                    break;
            }
        }
    }

    private onKeyDown(eventType: RemoteHandlerEventTypesAppleTV | RemoteHandlerEventTypesAndroid) {
        if (!this._stopKeyDownEvents) {
            if (eventType === EVENT_TYPE_SELECT) {
                CoreManager.getCurrentFocus()?.onPress();
            }
            if (eventType === EVENT_TYPE_LONG_SELECT) {
                CoreManager.getCurrentFocus()?.onLongPress();
            }

            const direction = this.getDirectionName(eventType);

            if (this._animatingInterval) return;

            // TODO: Redo this, it's not right way
            if (CoreManager.isViewAnimating() && direction) {
                CoreManager?.getCurrentFocus()?.onBlur();
                this._animatingInterval = setInterval(() => {
                    if (!CoreManager.isViewAnimating()) {
                        clearInterval(this._animatingInterval);
                        this._animatingInterval = 0;
                        CoreManager.executeDirectionalFocus(direction);
                        CoreManager.executeScroll(direction);
                    }
                }, 100);
            } else {
                if (direction) {
                    CoreManager.executeDirectionalFocus(direction);
                    CoreManager.executeScroll(direction);
                }
            }
        }
    }

    private onKeyLongPress(eventType: RemoteHandlerEventTypesAppleTV | RemoteHandlerEventTypesAndroid) {
        const direction = this.getDirectionName(eventType);
        const parent = CoreManager.getCurrentFocus()?.getParent();

        if (direction &&
            (parent?.isHorizontal() && ['down', 'up'].includes(direction!)) ||
            (!parent?.isHorizontal() && ['left', 'right'].includes(direction!))
        ) {
            CoreManager.executeDirectionalFocus(direction!);
            CoreManager.executeScroll(direction!);
            return;
        }

        if (this.isInRecycler() && direction) {
            this._stopKeyDownEvents = true;
            this._longPressInterval = setInterval(
                () => {
                    const selectedIndex = this.getSelectedIndex();
                    CoreManager.executeDirectionalFocus(direction);
                    CoreManager.executeScroll(direction, true);

                    if (selectedIndex === 0 || selectedIndex === this.getMaxIndex()) {
                        this.onKeyUp(direction);
                    }
                },
                CoreManager.getCurrentFocus()?.getParent() instanceof Grid
                    ? LONG_PRESS_INTERVAL_TIME_MS_GRID
                    : LONG_PRESS_INTERVAL_TIME_MS
            );
        }
    }

    private onKeyUp(eventType: RemoteHandlerEventTypesAppleTV | RemoteHandlerEventTypesAndroid) {
        const direction = this.getDirectionName(eventType);
        if (this._longPressInterval) {
            clearInterval(this._longPressInterval);
            this._longPressInterval = null;
            this._stopKeyDownEvents = false;
            CoreManager.executeScroll(direction!);
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
        const isRecyclable = parent instanceof RecyclerView || parent instanceof Row || parent instanceof Grid;

        if (parent && isRecyclable) {
            return parent.getLayouts().length;
        }

        return 0;
    }

    private isInRecycler(): boolean {
        const parent = CoreManager.getCurrentFocus()?.getParent();

        return parent instanceof RecyclerView || parent instanceof Row || parent instanceof Grid ? true : false;
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

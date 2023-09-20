import { View as RNView } from 'react-native';
import { ScreenProps } from '../types';
import CoreManager from '../service/core';
import Logger from '../service/logger';
import FocusModel, { MODEL_TYPES } from './abstractFocusModel';
import View from './view';
import { findLowestRelativeCoordinates, measureSync } from '../layoutManager';
import Recycler from './recycler';
import Event, { EVENT_TYPES } from '../events';
import { MutableRefObject } from 'react';
import { Ratio } from '../../helpers';

export const SCREEN_STATES = {
    BACKGROUND: 'background',
    FOREGROUND: 'foreground',
} as const;

export const VIEWPORT_ALIGNMENT = {
    BOTH_EDGE: 'bot-edge',
    LOW_EDGE: 'low-edge',
} as const;

const DELAY_TIME_IN_MS = 100;
const INTERVAL_TIME_IN_MS = 100;
export const DEFAULT_VIEWPORT_OFFSET = Ratio(70);

class Screen extends FocusModel {
    private _state: typeof SCREEN_STATES[keyof typeof SCREEN_STATES];
    private _prevState: typeof SCREEN_STATES[keyof typeof SCREEN_STATES];
    private _verticalWindowAlignment: typeof VIEWPORT_ALIGNMENT[keyof typeof VIEWPORT_ALIGNMENT];
    private _horizontalWindowAlignment: typeof VIEWPORT_ALIGNMENT[keyof typeof VIEWPORT_ALIGNMENT];
    private _order: number;
    private _focusKey?: string;
    private _horizontalViewportOffset: number;
    private _verticalViewportOffset: number;
    private _initialLoadInProgress: boolean;
    private _componentsPendingLayoutMap: { [key: string]: boolean };
    private _unmountingComponents: number;
    private _preferredFocus: View | null = null;
    private _currentFocus: View | null = null;
    private _precalculatedFocus: View | null = null;
    private _stealFocus: boolean;
    private _isFocused: boolean;
    private _group?: string;
    private _autoFocusEnabled = true;
    private _interval?: NodeJS.Timer;

    constructor(params: Omit<ScreenProps & ScreenProps['focusOptions'], 'style' | 'children' | 'focusOptions'>) {
        super(params);

        const {
            screenState = SCREEN_STATES.FOREGROUND,
            screenOrder = 0,
            stealFocus = true,
            focusKey,
            group,
            verticalWindowAlignment = VIEWPORT_ALIGNMENT.LOW_EDGE,
            horizontalWindowAlignment = VIEWPORT_ALIGNMENT.LOW_EDGE,
            horizontalViewportOffset = DEFAULT_VIEWPORT_OFFSET,
            verticalViewportOffset = DEFAULT_VIEWPORT_OFFSET,
            forbiddenFocusDirections = [],
            autoFocusEnabled = true,
            onFocus,
            onBlur,
        } = params;

        this._id = `screen-${CoreManager.generateID(8)}`;
        this._type = 'screen';
        this._group = group;
        this._state = screenState;
        this._prevState = screenState;
        this._order = screenOrder;
        this._focusKey = focusKey;
        this._verticalWindowAlignment = verticalWindowAlignment;
        this._horizontalWindowAlignment = horizontalWindowAlignment;
        this._horizontalViewportOffset = horizontalViewportOffset;
        this._verticalViewportOffset = verticalViewportOffset;
        this._forbiddenFocusDirections = forbiddenFocusDirections;
        this._stealFocus = stealFocus;
        this._isFocused = false;
        this._unmountingComponents = 0;
        this._initialLoadInProgress = true;
        this._autoFocusEnabled = autoFocusEnabled;

        this._componentsPendingLayoutMap = {};

        this._onFocus = onFocus;
        this._onBlur = onBlur;

        this._onMount = this._onMount.bind(this);
        this._onUnmount = this._onUnmount.bind(this);
        this._onLayout = this._onLayout.bind(this);

        this._events = [
            Event.subscribe(this.getType(), this.getId(), EVENT_TYPES.ON_MOUNT, this._onMount),
            Event.subscribe(this.getType(), this.getId(), EVENT_TYPES.ON_UNMOUNT, this._onUnmount),
            Event.subscribe(this.getType(), this.getId(), EVENT_TYPES.ON_LAYOUT, this._onLayout),
        ];
    }

    // EVENTS
    private _onMount() {
        CoreManager.registerFocusAwareComponent(this);
    }

    private _onUnmount() {
        CoreManager.removeFocusAwareComponent(this);
        this.onScreenRemoved();
        this.unsubscribeEvents();
        clearInterval(this._interval);
    }

    private _onLayout() {
        measureSync({ model: this });
    }

    // END EVENTS

    public onScreenRemoved() {
        const screens = Object.values(CoreManager.getScreens()).filter(
            (c) => c.isInForeground() && c.getOrder() === CoreManager.getCurrentMaxOrder() && c.isAutoFocusEnabled()
        );

        const nextScreen = screens.find((c) => c?.hasStealFocus()) ?? screens[0];
        if (nextScreen) {
            nextScreen.setFocus(nextScreen.getFirstFocusableOnScreen());
        }
    }

    public addComponentToPendingLayoutMap(id: string): void {
        this._componentsPendingLayoutMap[id] = true;
    }

    public removeComponentFromPendingLayoutMap(id: string): void {
        if (this._initialLoadInProgress) {
            setTimeout(() => {
                delete this._componentsPendingLayoutMap[id];

                if (Object.keys(this._componentsPendingLayoutMap).length <= 0 && this._initialLoadInProgress) {
                    this._initialLoadInProgress = false;
                    if (this._stealFocus) {
                        this.setFocus(this.getFirstFocusableOnScreen());
                    }
                }
            }, DELAY_TIME_IN_MS);
        }
    }

    public setFocus(model: View | null) {
        if (model) {
            CoreManager.getCurrentFocus()?.getScreen()?.onBlur?.();
            CoreManager.executeFocus(model);
            model.getScreen()?.onFocus();
            if (model.getParent()?.getId() !== model.getScreen()?.getId()) {
                model.getParent()?.onFocus();
            }
        } else {
            Logger.log('Focusable not found');
        }
    }

    public onViewRemoved(model: View): void {
        // If layout was not yet measured and view removed, we must also remove it from pending layout map
        this.removeComponentFromPendingLayoutMap(model.getId());
        this._unmountingComponents++;

        setTimeout(() => {
            this._unmountingComponents--;
            if (model.getId() === this._currentFocus?.getId()) {
                this._currentFocus = null;
            }
            if (model.getId() === this._preferredFocus?.getId()) {
                this._preferredFocus = null;
            }
            if (model.getId() === this._precalculatedFocus?.getId()) {
                this._precalculatedFocus = null;
            }
            if (this._unmountingComponents <= 0 && !this._currentFocus) {
                const view = this.getFirstFocusableOnScreen();

                if (view) {
                    this.setFocus(view);
                } else if (CoreManager.getScreens()[this.getId()]) {
                    // If there is no elements wait while first appears
                    // If there is no elements wait while first appears
                    this._interval = setInterval(() => {
                        const view = this.getFirstFocusableOnScreen();
                        if (view) {
                            this.setFocus(view);
                            clearInterval(this._interval);
                        }
                    }, INTERVAL_TIME_IN_MS);
                }
            }
        }, DELAY_TIME_IN_MS);
    }

    public getFirstFocusableOnScreen = (): View | null => {
        if (this.isInForeground() && CoreManager.isFocusManagerEnabled()) {
            if (this._currentFocus) return this._currentFocus;
            if (this._preferredFocus) return this._preferredFocus;
            if (this._precalculatedFocus) {
                const parent = this._precalculatedFocus.getParent();
                if (parent && [MODEL_TYPES.ROW, MODEL_TYPES.GRID].includes(parent.getType() as never)) {
                    const recycler = this._precalculatedFocus.getParent() as Recycler;
                    if (recycler.getFocusedView()) return recycler.getFocusedView();
                }
                return this._precalculatedFocus;
            }

            this.precalculateFocus(this);

            return this._precalculatedFocus;
        }

        return null;
    };

    private precalculateFocus(model: FocusModel) {
        model.getChildren().forEach((ch) => {
            this.precalculateFocus(ch);
        });

        if (model.getType() === MODEL_TYPES.VIEW) {
            findLowestRelativeCoordinates(model as View);
        }
    }

    public getState() {
        return this._state;
    }

    public setState(value: typeof SCREEN_STATES[keyof typeof SCREEN_STATES]) {
        this._state = value;

        return this;
    }

    public isInBackground(): boolean {
        return this._state === SCREEN_STATES.BACKGROUND;
    }

    public isInForeground(): boolean {
        return this._state === SCREEN_STATES.FOREGROUND;
    }

    public setPrevState(value: typeof SCREEN_STATES[keyof typeof SCREEN_STATES]) {
        this._prevState = value;

        return this;
    }

    public isPrevStateBackground(): boolean {
        return this._prevState === SCREEN_STATES.BACKGROUND;
    }

    public getVerticalWindowAlignment() {
        return this._verticalWindowAlignment;
    }

    public getHorizontalWindowAlignment() {
        return this._horizontalWindowAlignment;
    }

    public setOrder(value: number): this {
        this._order = value;

        return this;
    }

    public getOrder(): number {
        return this._order;
    }

    public getFocusKey(): string | undefined {
        return this._focusKey;
    }

    public setFocusKey(value?: string): this {
        this._focusKey = value;

        return this;
    }

    public getHorizontalViewportOffset(): number {
        return this._horizontalViewportOffset;
    }

    public getVerticalViewportOffset(): number {
        return this._verticalViewportOffset;
    }

    public setInitialLoadInProgress(value: boolean): this {
        this._initialLoadInProgress = value;

        return this;
    }

    public isInitialLoadInProgress(): boolean {
        return this._initialLoadInProgress;
    }

    public getChildren(): FocusModel[] {
        return this._children;
    }

    public setPreferredFocus(model: View | null): this {
        this._preferredFocus = model;

        return this;
    }

    public getPreferredFocus(): View | null {
        return this._preferredFocus;
    }

    public setPrecalculatedFocus(model: View | null): this {
        this._precalculatedFocus = model;

        return this;
    }

    public setCurrentFocus(model: View | null): this {
        this._currentFocus = model;

        return this;
    }

    public getCurrentFocus(): View | null {
        return this._currentFocus;
    }

    public getPrecalculatedFocus(): View | null {
        return this._precalculatedFocus;
    }

    public setIsFocused(isFocused: boolean): this {
        this._isFocused = isFocused;

        return this;
    }

    public getIsFocused(): boolean {
        return this._isFocused;
    }

    public hasStealFocus(): boolean {
        return this._stealFocus;
    }

    public isAutoFocusEnabled(): boolean {
        return this._autoFocusEnabled;
    }

    public getGroup() {
        return this._group;
    }

    public getNode(): MutableRefObject<RNView> {
        return this.node;
    }
}

export default Screen;

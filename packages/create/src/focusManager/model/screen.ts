import { View as RNView } from 'react-native';
import { ScreenProps, ScreenStates } from '../types';
import CoreManager from '../service/core';
import Logger from '../service/logger';
import FocusModel, { TYPE_RECYCLER, TYPE_VIEW } from './FocusModel';
import View from './view';
import { findLowestRelativeCoordinates, measureSync } from '../layoutManager';
import { DEFAULT_VIEWPORT_OFFSET } from '../constants';
import Recycler from './recycler';
import Event, { EVENT_TYPES } from '../events';
import { MutableRefObject } from 'react';

const DELAY_TIME_IN_MS = 100;

export const STATE_BACKGROUND: ScreenStates = 'background';
export const STATE_FOREGROUND: ScreenStates = 'foreground';
const ALIGNMENT_BOTH_EDGE = 'bot-edge';
const ALIGNMENT_LOW_EDGE = 'low-edge';

class Screen extends FocusModel {
    public _type: string;
    private _state: typeof STATE_BACKGROUND | typeof STATE_FOREGROUND;
    private _prevState: typeof STATE_BACKGROUND | typeof STATE_FOREGROUND;
    private _verticalWindowAlignment: typeof ALIGNMENT_LOW_EDGE;
    private _horizontalWindowAlignment: typeof ALIGNMENT_LOW_EDGE;
    private _order: number;
    private _focusKey: string;
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

    constructor(params: Omit<ScreenProps & ScreenProps['focusOptions'], 'style' | 'children' | 'focusOptions'>) {
        super(params);

        const {
            screenState = STATE_FOREGROUND,
            screenOrder = 0,
            stealFocus = true,
            focusKey = '',
            group,
            verticalWindowAlignment = ALIGNMENT_LOW_EDGE,
            horizontalWindowAlignment = ALIGNMENT_LOW_EDGE,
            horizontalViewportOffset = DEFAULT_VIEWPORT_OFFSET,
            verticalViewportOffset = DEFAULT_VIEWPORT_OFFSET,
            forbiddenFocusDirections = [],
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
        this._forbiddenFocusDirections = CoreManager.alterForbiddenFocusDirections(forbiddenFocusDirections);
        this._stealFocus = stealFocus;
        this._isFocused = false;
        this._unmountingComponents = 0;
        this._initialLoadInProgress = true;

        this._componentsPendingLayoutMap = {};

        this._onFocus = onFocus;
        this._onBlur = onBlur;

        this._onMount = this._onMount.bind(this);
        this._onUnmount = this._onUnmount.bind(this);
        this._onLayout = this._onLayout.bind(this);
        this._onPropertyChanged = this._onPropertyChanged.bind(this);

        this._events = [
            Event.subscribe(this, EVENT_TYPES.ON_MOUNT, this._onMount),
            Event.subscribe(this, EVENT_TYPES.ON_UNMOUNT, this._onUnmount),
            Event.subscribe(this, EVENT_TYPES.ON_LAYOUT, this._onLayout),
            Event.subscribe(this, EVENT_TYPES.ON_PROPERTY_CHANGED, this._onPropertyChanged),
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
    }

    private _onLayout() {
        measureSync({ model: this });
    }

    private _onPropertyChanged({ property, newValue }: { property: string; newValue: ScreenStates | number }) {
        switch (property) {
            case 'state':
                this.setPrevState(this.getState()).setState(newValue as ScreenStates);
                if (this.isPrevStateBackground() && this.isInForeground()) {
                    this.setFocus(this.getFirstFocusableOnScreen());
                }
                break;
            case 'order':
                this.setOrder(newValue as number);
                break;
            default:
                break;
        }
    }

    // END EVENTS

    public onScreenRemoved() {
        const screens = Object.values(CoreManager._screens).filter(
            (c) => c.isInForeground() && c.getOrder() === CoreManager.getCurrentMaxOrder()
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

                if (Object.keys(this._componentsPendingLayoutMap).length <= 0) {
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
            Logger.getInstance().log('Focusable not found');
        }
    }

    public onViewRemoved(model: View): void {
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
                this.setFocus(this.getFirstFocusableOnScreen());
            }
        }, DELAY_TIME_IN_MS);
    }

    public getFirstFocusableOnScreen = (): View | null => {
        if (this.isInForeground()) {
            if (this._currentFocus) return this._currentFocus;
            if (this._preferredFocus) return this._preferredFocus;
            if (this._precalculatedFocus) {
                if (this._precalculatedFocus.getParent()?.getType() === TYPE_RECYCLER) {
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

        if (model.getType() === TYPE_VIEW) {
            findLowestRelativeCoordinates(model as View);
        }
    }

    public getType(): string {
        return this._type;
    }

    public getState(): typeof STATE_BACKGROUND | typeof STATE_FOREGROUND {
        return this._state;
    }

    public setState(value: typeof STATE_BACKGROUND | typeof STATE_FOREGROUND) {
        this._state = value;

        return this;
    }

    public isInBackground(): boolean {
        return this._state === STATE_BACKGROUND;
    }

    public isInForeground(): boolean {
        return this._state === STATE_FOREGROUND;
    }

    public setPrevState(value: typeof STATE_BACKGROUND | typeof STATE_FOREGROUND) {
        this._prevState = value;

        return this;
    }

    public isPrevStateBackground(): boolean {
        return this._prevState === STATE_BACKGROUND;
    }

    public getVerticalWindowAlignment(): typeof ALIGNMENT_BOTH_EDGE | typeof ALIGNMENT_LOW_EDGE {
        return this._verticalWindowAlignment;
    }

    public getHorizontalWindowAlignment(): typeof ALIGNMENT_BOTH_EDGE | typeof ALIGNMENT_LOW_EDGE {
        return this._horizontalWindowAlignment;
    }

    public setOrder(value: number): this {
        this._order = value;

        return this;
    }

    public getOrder(): number {
        return this._order;
    }

    public getFocusKey(): string {
        return this._focusKey;
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

    public getGroup() {
        return this._group;
    }

    public getNode(): MutableRefObject<RNView> {
        return this.node;
    }
}

export default Screen;

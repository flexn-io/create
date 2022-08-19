import { ScreenStates, ForbiddenFocusDirections } from '../types';
import CoreManager from './core';
import Logger from './logger';
import { makeid } from '../helpers';
import AbstractFocusModel from './AbstractFocusModel';
import View from './view';
import { alterForbiddenFocusDirections } from '../helpers';
import { findLowestRelativeCoordinates } from '../layoutManager';
import { DEFAULT_VIEWPORT_OFFSET } from '../constants';
import Recycler from './recycler';

const DELAY_TIME_IN_MS = 100;

export const STATE_BACKGROUND: ScreenStates = 'background';
export const STATE_FOREGROUND: ScreenStates = 'foreground';
const ALIGNMENT_BOTH_EDGE = 'bot-edge';
const ALIGNMENT_LOW_EDGE = 'low-edge';

class Screen extends AbstractFocusModel {
    public _type: string;
    private _state: typeof STATE_BACKGROUND | typeof STATE_FOREGROUND;
    private _prevState: typeof STATE_BACKGROUND | typeof STATE_FOREGROUND;
    private _verticalWindowAlignment: typeof ALIGNMENT_BOTH_EDGE | typeof ALIGNMENT_LOW_EDGE;
    private _horizontalWindowAlignment: typeof ALIGNMENT_BOTH_EDGE | typeof ALIGNMENT_LOW_EDGE;
    private _order: number;
    private _focusKey: string;
    private _horizontalViewportOffset: number;
    private _verticalViewportOffset: number;
    private _forbiddenFocusDirections: ForbiddenFocusDirections[];
    private _initialLoadInProgress: boolean;
    private _componentsPendingLayoutMap: { [key: string]: boolean };
    private _unmountingComponents: number;
    private _preferredFocus?: View;
    private _currentFocus?: View;
    private _precalculatedFocus?: View;
    private _stealFocus: boolean;
    private _isFocused: boolean;
    private _repeatContext:
        | {
              parentContext: AbstractFocusModel;
              index: number;
          }
        | undefined;

    private _onFocus?: () => void;
    private _onBlur?: () => void;

    constructor(params: any) {
        super(params);

        const {
            state = STATE_FOREGROUND,
            prevState = STATE_FOREGROUND,
            order = 0,
            stealFocus = true,
            focusKey = '',
            verticalWindowAlignment = ALIGNMENT_LOW_EDGE,
            horizontalWindowAlignment = ALIGNMENT_LOW_EDGE,
            horizontalViewportOffset = DEFAULT_VIEWPORT_OFFSET,
            verticalViewportOffset = DEFAULT_VIEWPORT_OFFSET,
            forbiddenFocusDirections = [],
            onFocus,
            onBlur,
        } = params;

        this._id = `screen-${makeid(8)}`;
        this._type = 'screen';
        this._state = state;
        this._prevState = prevState;
        this._order = order;
        this._focusKey = focusKey;
        this._verticalWindowAlignment = verticalWindowAlignment;
        this._horizontalWindowAlignment = horizontalWindowAlignment;
        this._horizontalViewportOffset = horizontalViewportOffset;
        this._verticalViewportOffset = verticalViewportOffset;
        this._forbiddenFocusDirections = alterForbiddenFocusDirections(forbiddenFocusDirections);
        this._stealFocus = stealFocus;
        this._isFocused = false;
        this._unmountingComponents = 0;
        this._initialLoadInProgress = true;

        this._componentsPendingLayoutMap = {};

        this._onFocus = onFocus;
        this._onBlur = onBlur;
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

    public setFocus(cls?: AbstractFocusModel) {
        if (cls) {
            CoreManager.getCurrentFocus()?.getScreen()?.onBlur?.();
            CoreManager.executeFocus(cls);
            CoreManager.executeUpdateGuideLines();
            cls.getScreen()?.onFocus();
            if (cls.getParent()?.getId() !== cls.getScreen()?.getId()) {
                cls.getParent()?.onFocus();
            }
        } else {
            Logger.getInstance().log('Focusable not found');
        }
    }

    public onViewRemoved(cls: View): void {
        this._unmountingComponents++;

        setTimeout(() => {
            this._unmountingComponents--;
            if (cls.getId() === this._currentFocus?.getId()) {
                delete this._currentFocus;
            }
            if (cls.getId() === this._preferredFocus?.getId()) {
                delete this._preferredFocus;
            }
            if (cls.getId() === this._precalculatedFocus?.getId()) {
                delete this._precalculatedFocus;
            }
            if (this._unmountingComponents <= 0 && !this._currentFocus) {
                this.setFocus(this.getFirstFocusableOnScreen());
            }
        }, DELAY_TIME_IN_MS);
    }

    public getFirstFocusableOnScreen = (): AbstractFocusModel | undefined => {
        if (this.isInForeground()) {
            if (this._currentFocus) return this._currentFocus;
            if (this._preferredFocus) return this._preferredFocus;
            if (this._precalculatedFocus) {
                if (this._precalculatedFocus.getParent()?.isRecyclable()) {
                    const recycler = this._precalculatedFocus.getParent() as Recycler;
                    if (recycler.getFocusedView()) return recycler.getFocusedView();
                }
                return this._precalculatedFocus;
            }

            this.precalculateFocus(this);

            return this._precalculatedFocus;
        }
    };

    private precalculateFocus(cls: AbstractFocusModel) {
        cls.getChildren().forEach((ch) => {
            this.precalculateFocus(ch);
        });

        findLowestRelativeCoordinates(cls);
    }

    public getType(): string {
        return this._type;
    }

    public setScreen(_cls: AbstractFocusModel): this {
        return this;
    }

    public getScreen(): undefined {
        return undefined;
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
    };

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

    public getForbiddenFocusDirections(): ForbiddenFocusDirections[] {
        return this._forbiddenFocusDirections;
    }

    public setInitialLoadInProgress(value: boolean): this {
        this._initialLoadInProgress = value;

        return this;
    }

    public isInitialLoadInProgress(): boolean {
        return this._initialLoadInProgress;
    }

    public getChildren(): AbstractFocusModel[] {
        return this._children;
    }

    public getParent(): AbstractFocusModel | undefined {
        return undefined;
    }

    public setPreferredFocus(cls: View): this {
        this._preferredFocus = cls;

        return this;
    }

    public getPreferredFocus(): View | undefined {
        return this._preferredFocus;
    }

    public setPrecalculatedFocus(cls: View): this {
        this._precalculatedFocus = cls;

        return this;
    }

    public setCurrentFocus(cls: View): this {
        this._currentFocus = cls;

        return this;
    }

    public getCurrentFocus(): View | undefined {
        return this._currentFocus;
    }

    public getPrecalculatedFocus(): View | undefined {
        return this._precalculatedFocus;
    }

    public setIsFocused(isFocused: boolean): this {
        this._isFocused = isFocused;

        return this;
    }

    public getIsFocused(): boolean {
        return this._isFocused;
    }

    public isFocusable(): boolean {
        return false;
    }

    public getRepeatContext(): { parentContext: AbstractFocusModel; index: number } | undefined {
        return this._repeatContext;
    }

    public hasStealFocus(): boolean {
        return this._stealFocus;
    }

    public isScreen(): boolean {
        return true;
    }

    public onFocus(): void {
        if (this._onFocus) {
            this._onFocus();
        }
    }

    public onBlur(): void {
        if (this._onBlur) {
            this._onBlur();
        }
    }

    public setRepeatContext(_value: any): this {
        return this;
    }
}

export default Screen;

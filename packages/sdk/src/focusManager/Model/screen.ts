import { ScreenStates, ForbiddenFocusDirections } from '../types';
import CoreManager from '../core';
import logger from '../logger';
import { makeid } from '../helpers';
import AbstractFocusModel from './AbstractFocusModel';
import { ViewCls } from './view';
import { alterForbiddenFocusDirections } from '../../focusManager/helpers';
import { findLowestRelativeCoordinates } from '../../focusManager/layoutManager';

const DELAY_TIME_IN_MS = 150;

export const STATE_BACKGROUND: ScreenStates = 'background';
export const STATE_FOREGROUND: ScreenStates = 'foreground';
const ALIGNMENT_BOTH_EDGE = 'bot-edge';
const ALIGNMENT_LOW_EDGE = 'low-edge';

export class Screen extends AbstractFocusModel {
    public _type: string;
    private _state: typeof STATE_BACKGROUND | typeof STATE_FOREGROUND;
    public _prevState: typeof STATE_BACKGROUND | typeof STATE_FOREGROUND;
    public _verticalWindowAlignment: typeof ALIGNMENT_BOTH_EDGE | typeof ALIGNMENT_LOW_EDGE;
    public _horizontalWindowAlignment: typeof ALIGNMENT_BOTH_EDGE | typeof ALIGNMENT_LOW_EDGE;
    public _order: number;
    public _focusKey: string;
    public _horizontalViewportOffset: number;
    public _verticalViewportOffset: number;
    public _forbiddenFocusDirections: ForbiddenFocusDirections[];
    public _initialLoadInProgress: boolean;
    public _loadingComponents: number;
    public _unmountingComponents: number;
    public _parent?: AbstractFocusModel;

    private _preferredFocus?: ViewCls;
    private _currentFocus?: ViewCls;
    private _precalculatedFocus?: ViewCls;

    public _isFocused: boolean;
    public _stealFocus: boolean;

    public _repeatContext:
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
            horizontalViewportOffset = 0,
            verticalViewportOffset = 0,
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
        this._loadingComponents = 0;
        this._unmountingComponents = 0;
        this._initialLoadInProgress = true;

        this._onFocus = onFocus;
        this._onBlur = onBlur;
    }

    public destroy(): void {
        destroyInstance(this._id);
    }

    public setIsLoading() {
        if (this._initialLoadInProgress) {
            this._loadingComponents++;

            setTimeout(() => {
                this._loadingComponents--;

                if (this._loadingComponents <= 0) {
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
            CoreManager.executeFocus('', cls);
            CoreManager.executeUpdateGuideLines();
            cls.onFocus();
        } else {
            logger.log('Focusable not found');
        }
    }

    public onViewRemoved(cls: ViewCls): void {
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
            if (this._unmountingComponents <= 0) {
                this.setFocus(this.getFirstFocusableOnScreen());
            }
        }, DELAY_TIME_IN_MS);
    }

    public getFirstFocusableOnScreen = (): AbstractFocusModel | undefined => {
        if (this.isInForeground()) {
            if (this._currentFocus) return this._currentFocus;
            if (this._preferredFocus) return this._preferredFocus;
            if (this._precalculatedFocus) return this._precalculatedFocus;

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

    public setPreferredFocus(cls: ViewCls): this {
        this._preferredFocus = cls;

        return this;
    }

    public getPreferredFocus(): ViewCls | undefined {
        return this._preferredFocus;
    }

    public setPrecalculatedFocus(cls: ViewCls): this {
        this._precalculatedFocus = cls;

        return this;
    }

    public setCurrentFocus(cls: ViewCls): this {
        this._currentFocus = cls;

        return this;
    }

    public getCurrentFocus(): ViewCls | undefined {
        return this._currentFocus;
    }

    public getPrecalculatedFocus(): ViewCls | undefined {
        return this._precalculatedFocus;
    }

    public setIsFocused(isFocused: boolean): this {
        this._isFocused = isFocused;

        return this;
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

const ScreenInstances: { [key: string]: Screen } = {};
function createInstance(context: any): Screen {
    const _Screen = new Screen(context);
    ScreenInstances[_Screen.getId()] = _Screen;

    return ScreenInstances[_Screen.getId()];
}

function destroyInstance(id: string) {
    if (ScreenInstances[id]) {
        delete ScreenInstances[id];
    }
}

export type ScreenCls = Screen;

export { createInstance, destroyInstance };

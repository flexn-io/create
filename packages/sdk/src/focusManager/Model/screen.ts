import { ScreenStates, ForbiddenFocusDirections } from '../types';
import CoreManager from '../core';
import logger from '../logger';
import { makeid } from '../helpers';
import AbstractFocusModel from './AbstractFocusModel';
import { ViewCls } from './view';
import { alterForbiddenFocusDirections } from '../../focusManager/helpers';

const WAIT_TO_LOAD_DELAY = 100;

const STATE_BACKGROUND: ScreenStates = 'background';
const STATE_FOREGROUND: ScreenStates = 'foreground';
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
    public _nextFocusRight: string;
    public _nextFocusLeft: string;
    public _initialLoadInProgress: boolean;
    public _loadingComponents: number;
    public _parent?: AbstractFocusModel;
    public _initialFocus?: ViewCls;
    public _lastFocused?: ViewCls;
    public _firstFocusable?: ViewCls;
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
        super();

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
            nextFocusRight = '',
            nextFocusLeft = '',
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
        this._nextFocusRight = nextFocusRight;
        this._nextFocusLeft = nextFocusLeft;
        this._stealFocus = stealFocus;
        this._isFocused = false;
        this._loadingComponents = 0;
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

            if (this._stealFocus) {
                this.setFocus(this.getFirstFocusableOnScreen());
            }

            setTimeout(() => {
                this._loadingComponents--;

                if (this._loadingComponents <= 0) {
                    this._initialLoadInProgress = false;
                    if (this._stealFocus) {
                        this.setFocus(this.getFirstFocusableOnScreen());
                    }
                }
            }, WAIT_TO_LOAD_DELAY);
        }
    }

    public setFocus(cls: AbstractFocusModel | null) {
        if (cls) {
            CoreManager.getCurrentFocus()?.getScreen()?.onBlur?.();
            CoreManager.executeFocus('', cls);
            CoreManager.executeUpdateGuideLines();
            cls.onFocus?.();
        } else {
            logger.log('Focusable not found');
        }
    }

    public getFirstFocusableOnScreen = (): AbstractFocusModel | null => {
        if (this.isInBackground()) {
            return null;
        } else if (this._lastFocused) {
            return this._lastFocused;
        } else if (this._initialFocus) {
            return this._initialFocus;
        } else if (this._firstFocusable) {
            return this._firstFocusable;
        } else {
            return null;
        }
    };

    public getType(): string {
        return this._type;
    }

    public setLastFocused(cls: ViewCls): this {
        this._lastFocused = cls;

        return this;
    }

    public getLastFocused(): ViewCls | undefined {
        return this._lastFocused;
    }

    public setFirstFocusable(cls: ViewCls): this {
        this._firstFocusable = cls;

        return this;
    }

    public getFirstFocusable(): ViewCls | undefined {
        return this._firstFocusable;
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

    public getNextFocusRight(): string {
        return this._nextFocusRight;
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

    public getInitialFocus(): ViewCls | undefined {
        return this._initialFocus;
    }

    public getNextFocusLeft(): string {
        return this._nextFocusLeft;
    }

    public setIsFocused(isFocused: boolean): this {
        this._isFocused = isFocused;

        return this;
    }

    public isFocusable(): boolean {
        return false;
    }

    public setInitialFocus(cls: ViewCls): this {
        this._initialFocus = cls;

        return this;
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

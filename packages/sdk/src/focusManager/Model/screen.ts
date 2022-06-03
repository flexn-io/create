import { Context, ScreenStates } from '../types';
import { SCREEN_STATES } from '../constants';
import CoreManager from '../core';
import logger from '../logger';
import { makeid } from '../helpers';
import AbstractFocusModel from './AbstractFocusModel';
import { ViewCls } from './view';

const WAIT_TO_LOAD_DELAY = 100;

const STATE_BACKGROUND: ScreenStates = 'background';
const STATE_FOREGROUND: ScreenStates = 'foreground';

class Screen extends AbstractFocusModel {
    public context: any;
    public initialLoadInProgress: boolean;

    private _loadingComponents: number;

    public id: string;
    public children: AbstractFocusModel[];
    public repeatContext?: {
        parentContext: AbstractFocusModel;
        index: number;
    };
    public parent?: AbstractFocusModel;

    public initialFocus?: ViewCls;
    public lastFocused?: ViewCls;
    public firstFocusable?: ViewCls;

    public type: string;
    public isFocused: boolean;
    public stealFocus: boolean;

    private _onFocus?: () => void;
    private _onBlur?: () => void;

    constructor(params: any) {
        super();

        this.children = [];
        this.type = '';
        this.id = '';
        this.isFocused = false;
        this.stealFocus = true;

        this.context = {};
        this.createContext(params);
        this._loadingComponents = 0;
        this.initialLoadInProgress = true;
        this._onFocus = params.onFocus;
        this._onBlur = params.onBlur;
    }

    private createContext(params: any) {
        const id = makeid(8);

        this.context = {
            id: `screen-${id}`,
            type: 'screen',
            children: [],
            ...params,
        };

        this.id = `screen-${id}`;
        this.type = 'screen';
        this.stealFocus = params.stealFocus;
    }

    public destroy(): void {
        destroyInstance(this.id);
    }

    public setScreen(_cls: AbstractFocusModel): this {
        return this;
    }

    public getScreen(): this {
        return this;
    }

    public setIsLoading() {
        if (this.initialLoadInProgress) {
            this._loadingComponents++;

            setTimeout(() => {
                this._loadingComponents--;

                if (this._loadingComponents <= 0) {
                    this.initialLoadInProgress = false;
                    if (this.stealFocus) {
                        this.setFocus(this.getFirstFocusableOnScreen());
                    }
                }
            }, WAIT_TO_LOAD_DELAY);
        }
    }

    public getFirstFocusableOnScreen = (): AbstractFocusModel | null => {
        if (this.isInBackground()) {
            return null;
        } else if (this.lastFocused) {
            return this.lastFocused;
        } else if (this.initialFocus) {
            return this.initialFocus;
        } else if (this.firstFocusable) {
            return this.firstFocusable;
        } else {
            return null;
        }
    };

    public setFocus(cls: AbstractFocusModel | null) {
        console.log('SETTING FOCUS...', cls);
        if (cls) {
            CoreManager.getCurrentFocus()?.getScreen()?.onBlur?.();
            CoreManager.executeFocus('', cls);
            CoreManager.executeUpdateGuideLines();
            cls.onFocus?.();
        } else {
            logger.log('Focusable not found');
        }
    }

    public getContext() {
        return this.context;
    }

    public isInBackground(): boolean {
        return this.context.state === STATE_BACKGROUND;
    }

    public isInForeground(): boolean {
        return this.context.state === STATE_FOREGROUND;
    }

    public get isPrevStateBackground(): boolean {
        return this.context.prevState === STATE_BACKGROUND;
    }

    public setState(value: string) {
        this.context.state = value;

        return this;
    }

    public setPrevState(value: string) {
        this.context.prevState = value;

        return this;
    }

    public setIsFocused(isFocused: boolean): this {
        this.isFocused = isFocused;

        return this;
    }

    public isFocusable(): boolean {
        return false;
    }

    public setInitialFocus(cls: ViewCls): this {
        this.initialFocus = cls;

        return this;
    }

    public getInitialFocus(): ViewCls | undefined {
        return this.initialFocus;
    }

    public setLastFocused(cls: ViewCls): this {
        this.lastFocused = cls;

        return this;
    }

    public getLastFocused(): ViewCls | undefined {
        return this.lastFocused;
    }

    public setFirstFocusable(cls: ViewCls): this {
        this.firstFocusable = cls;

        return this;
    }

    public getFirstFocusable(): ViewCls | undefined {
        return this.firstFocusable;
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
}

const ScreenInstances: { [key: string]: Screen } = {};
function createOrReturnInstance(context: any) {
    if (ScreenInstances[context.id]) {
        return ScreenInstances[context.id];
    }

    const _Screen = new Screen(context);
    ScreenInstances[_Screen.id] = _Screen;

    return ScreenInstances[_Screen.id];
}

function destroyInstance(context: Context) {
    if (ScreenInstances[context.id]) {
        delete ScreenInstances[context.id];
    }
}

export type ScreenCls = Screen;

export { createOrReturnInstance, destroyInstance };

import { Context, ScreenStates } from '../types';
import { SCREEN_STATES } from '../constants';
import CoreManager from '../core';
import logger from '../logger';
import { makeid } from '../helpers';
import AbstractFocusModel from './AbstractFocusModel';

const WAIT_TO_LOAD_DELAY = 100;

const STATE_BACKGROUND: ScreenStates = 'background';
const STATE_FOREGROUND: ScreenStates = 'foreground';

class Screen extends AbstractFocusModel {
    public context: any;
    public initialLoadInProgress: boolean;

    private _loadingComponents: number;

    public id: string;
    public children: AbstractFocusModel[];
    public parentContext: AbstractFocusModel;
    public repeatContext: AbstractFocusModel;
    public parent?: AbstractFocusModel;
    public initialFocus?: AbstractFocusModel;
    public type: string;

    constructor(params: any) {
        super();

        this.children = [];
        this.parentContext = this;
        this.repeatContext = this;
        this.type = '';
        this.id = '';

        this.context = {};
        this.createContext(params);
        this._loadingComponents = 0;
        this.initialLoadInProgress = true;
    }

    private createContext(params: any) {
        this.context = {
            id: `screen-${makeid(8)}`,
            type: 'screen',
            children: [],
            ...params
        };

        this.id = `screen-${makeid(8)}`;
        this.type = 'screen';
    };

    public setInitialFocus(cls: AbstractFocusModel): this {
        this.initialFocus = cls;

        return this;
    }

    public setScreen(_cls: AbstractFocusModel): this {
        return this;
    }

    public setIsLoading() {
        if (this.initialLoadInProgress) {
            this._loadingComponents++;

            setTimeout(() => {
                this._loadingComponents--;
    
                if (this._loadingComponents <= 0) {
                    this.initialLoadInProgress = false;
                    if (this.context.stealFocus) {
                        this.setFocus(
                            this.getFirstFocusableOnScreen()
                        );
                    }
                }
            }, WAIT_TO_LOAD_DELAY);
        }
    };

    public getFirstFocusableOnScreen = (): Context | null => {
        if (this.context.state === SCREEN_STATES.BACKGROUND) {
            return null;
        } else if (this.context.lastFocused) {
            return this.context.lastFocused;
        } else if (this.context.initialFocus) {
            return this.context.initialFocus;
        } else if (this.context.firstFocusable) {
            return this.context.firstFocusable;
        } else {
            return null;
        }
    };

    public setFocus(context: Context | null) {
        if (context) {
            CoreManager.currentContext?.screen?.onBlur?.();
            CoreManager.executeFocus('', context);
            CoreManager.executeUpdateGuideLines();
            context.onFocus?.();
        } else {
            logger.log('Focusable not found');
        }
    }

    public getContext() {
        return this.context;
    }

    public get isInBackground(): boolean {
        return this.context.state === STATE_BACKGROUND;
    }

    public get isInForeground(): boolean {
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
};

const ScreenInstances: { [key: string]: Screen; } = {};
function createOrReturnInstance(context: any) {
    if (ScreenInstances[context.id]) {
        return ScreenInstances[context.id];
    }

    const _Screen = new Screen(context);
    ScreenInstances[_Screen.context.id] = _Screen;

    return ScreenInstances[_Screen.context.id];
};

function destroyInstance(context: Context) {
    if (ScreenInstances[context.id]) {
        delete ScreenInstances[context.id];
    }
}

export type ScreenCls = Screen;


export { createOrReturnInstance, destroyInstance };
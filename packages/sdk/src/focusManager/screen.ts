import { Context, ScreenStates } from './types';
import { SCREEN_STATES } from './constants';
import CoreManager from './core';
import logger from './logger';

const WAIT_TO_LOAD_DELAY = 100;

const STATE_BACKGROUND: ScreenStates = 'background';
const STATE_FOREGROUND: ScreenStates = 'foreground';

class Screen {
    public context: Context;
    public initialLoadInProgress: boolean;

    private _loadingComponents: number;

    constructor(context: Context) {
        this.context = context;

        this._loadingComponents = 0;
        this.initialLoadInProgress = true;
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

    public get isInBackground(): boolean {
        return this.context.state === STATE_BACKGROUND;
    }

    public get isInForeground(): boolean {
        return this.context.state === STATE_FOREGROUND;
    }
};

const ScreenInstances: { [key: string]: Screen; } = {};
function createOrReturnInstance(context: Context) {
    if (ScreenInstances[context.id]) {
        return ScreenInstances[context.id];
    }

    ScreenInstances[context.id] = new Screen(context);

    return ScreenInstances[context.id];
};

function destroyInstance(context: Context) {
    if (ScreenInstances[context.id]) {
        delete ScreenInstances[context.id];
    }
}

export type ScreenCls = Screen;


export { createOrReturnInstance, destroyInstance };
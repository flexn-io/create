import { findNodeHandle, UIManager } from 'react-native';
import { CONTEXT_TYPES, SCREEN_STATES } from './constants';
import { distCalc, executeScroll as execScroll } from './focusManager';
import { getNextForcedFocusKey } from './helpers';
import { recalculateLayout } from './layoutManager';
import logger from './logger';
import type { Context } from './types';
import AbstractFocusModel from './Model/AbstractFocusModel';
import { ViewCls } from './Model/view';

class CoreManager {
    public _focusableMap: {
        [key: string]: AbstractFocusModel;
    };

    public _currentFocus: AbstractFocusModel | null;

    private _debuggerEnabled: boolean;

    private _hasPendingUpdateGuideLines: boolean;

    private _guideLineY: number;

    private _guideLineX: number;

    constructor() {
        this._focusableMap = {};

        this._currentFocus = null;

        this._debuggerEnabled = false;
        this._hasPendingUpdateGuideLines = false;
        this._guideLineY = 0;
        this._guideLineX = 0;
    }

    public registerFocusable(cls: AbstractFocusModel, node?: any) {
        if (this._focusableMap[cls.id]) {
            return;
        }
        if (node) {
            const nodeId = findNodeHandle(node.current);
            cls.nodeId = nodeId;
            cls.node = node;
        }

        if (cls.type !== CONTEXT_TYPES.SCREEN) {
            let parentCls = cls?.parent;
            while (parentCls && parentCls.type !== CONTEXT_TYPES.SCREEN) {
                parentCls = parentCls.parent;
            }
            if (cls.initialFocus && !!parentCls) {
                this._focusableMap[parentCls.id].setInitialFocus(cls);
            }

            if (parentCls) {
                cls.setScreen(parentCls);
            }
        }

        this._focusableMap[cls.id] = cls;

        Object.keys(this._focusableMap).forEach((k) => {
            const v = this._focusableMap[k];

            // Register as parent for children
            if (v.parent && v.parent.id === cls.id) {
                cls.addChildren(v);
            }
            // Register as child in parent
            if (cls.parent && cls.parent.id === v.id) {
                v.addChildren(cls);
            }
        });

        console.log(this._focusableMap);
    }

    public registerContext() {}

    public removeFocusable(cls: AbstractFocusModel) {
        cls.children.forEach((ch) => {
            this.removeFocusable(ch);
        });

        delete this._focusableMap[cls.id];
        cls.destroy();
    }

    public removeContext(context: Context) {
        if (context.children) {
            context.children.forEach((ch: Context) => {
                this.removeContext(ch);
            });
        }

        // if (this._currentContext?.id === context.id) {
        //     this._currentContext = null;
        // }
        // delete this._contextMap[context.id];
    }

    public removeFromParentContext(context: Context) {
        if (context.parent) {
            context.parent.children.forEach((ch, index) => {
                if (ch.id === context.id) {
                    context.parent?.children.splice(index, 1);
                }
            });
        }
        // if (this._currentContext?.id === context.id) {
        //     this._currentContext = null;
        // }
        // delete this._contextMap[context.id];
    }

    public executeFocus(direction = '', cls?: AbstractFocusModel) {
        let nextFocusable;
        if (cls) nextFocusable = cls;
        else if (this._currentFocus?.parent) {
            nextFocusable = cls || this.getNextFocusableContext(direction, this._currentFocus.parent);
        }
        if (nextFocusable) {
            if (nextFocusable.id === this._currentFocus?.id) {
                return;
            }

            if (this._currentFocus) {
                // @ts-ignore
                UIManager.dispatchViewManagerCommand(this._currentFocus.nodeId, 'cmdBlur', null);
                this._currentFocus.onBlur();
                this._currentFocus.setIsFocused(false);
            }

            this._currentFocus = nextFocusable;
            // @ts-ignore
            UIManager.dispatchViewManagerCommand(nextFocusable.nodeId, 'cmdFocus', null);
            // console.log('nextFocusable', nextFocusable);
            nextFocusable.node?.current?.onFocus?.();
            nextFocusable.setIsFocused(true);
            if (nextFocusable.getScreen()) {
                nextFocusable.getScreen()?.setLastFocused(nextFocusable as ViewCls);
            }
        }
    }

    public executeScroll(direction = '') {
        const contextParameters = {
            currentFocusable: this._currentFocus,
            focusableMap: this._focusableMap,
            isDebuggerEnabled: this._debuggerEnabled,
        };
        execScroll(direction, contextParameters);
    }

    public executeUpdateGuideLines() {
        if (!this._currentFocus?.getLayout()) {
            this._hasPendingUpdateGuideLines = true;
            return;
        }
        if (this._guideLineX !== this._currentFocus.layout.absolute.xCenter) {
            this._guideLineX = this._currentFocus.layout.absolute.xCenter;
        }
        if (this._guideLineY !== this._currentFocus.layout.absolute.yCenter) {
            this._guideLineY = this._currentFocus.layout.absolute.yCenter;
        }
        this._hasPendingUpdateGuideLines = false;
    }

    public focusElementByFocusKey = (focusKey: string) => {
        // const focusAsNext: AbstractFocusModel | undefined = Object.values(this._focusableMap).find(
        //     (s) =>
        //         s.focusKey === focusKey &&
        //         (s?.screen?.state === SCREEN_STATES.FOREGROUND || s.state === SCREEN_STATES.FOREGROUND)
        // );
        // if (focusAsNext?.screen) {
        //     const nextFocusable = focusAsNext?.screen.screenCls?.getFirstFocusableOnScreen();
        //     if (nextFocusable) {
        //         this._currentContext?.screen?.onBlur?.();
        //         this.executeFocus('', nextFocusable);
        //         this.executeUpdateGuideLines();
        //         nextFocusable.screen?.onFocus?.();
        //     }
        // }
    };

    public getNextFocusableContext = (
        direction: string,
        parent: AbstractFocusModel,
        mustPickContext?: boolean,
        inScreenContext?: boolean
    ): AbstractFocusModel | undefined | null => {
        const currentFocus = this._currentFocus;
        const focusableMap = this._focusableMap;

        if (!currentFocus) {
            return focusableMap[Object.keys(focusableMap)[0]];
        }

        //TOFO FIX ?.
        const currentContextHasForbiddenDirection = currentFocus?.getForbiddenFocusDirections().includes(direction);

        if (currentContextHasForbiddenDirection) {
            return currentFocus;
        }

        const parentCls = parent;

        // This can happen if we opened new screen which doesn't have any focusable
        // then last screen in context map still keeping focus
        if (parentCls?.isInBackground()) {
            return currentFocus;
        }

        const ch = parentCls.children;
        const parents = [currentFocus.id];
        let p = currentFocus?.parent;
        while (p) {
            parents.push(p.id);
            p = p.parent;
        }
        logger.debug('FIND===============================', parents, ch);
        if (ch) {
            const output: {
                match1: number;
                match1IxOffset: number;
                match1Context?: AbstractFocusModel;
                match2: number;
                match2IxOffset: number;
                match2Context?: AbstractFocusModel;
                match3: number;
                match3IxOffset: number;
                match3Context?: AbstractFocusModel;
            } = {
                match1: 999999,
                match1IxOffset: 999999,
                match2: 9999999,
                match2IxOffset: 999999,
                match3: 9999999,
                match3IxOffset: 999999,
            };
            for (let i = 0; i < ch.length; i++) {
                const cls = ch[i];
                const notFocusableAndNoChildren = cls.children.length < 1 && !cls.isFocusable();
                if (notFocusableAndNoChildren) {
                    logger.debug('FOUND GROUP WITH NO CHILDREN!', cls.id);
                } else if (!parents.includes(cls.id) && !notFocusableAndNoChildren) {
                    this.findClosestNode(cls, direction, output);
                }
            }
            const closestContextFn = (): AbstractFocusModel | undefined => {
                if (output.match1Context || output.match2Context || output.match3Context) {
                    if (output.match3 < output.match2) {
                        return output.match3Context;
                    }
                    if (output.match2 < output.match1) {
                        return output.match2Context;
                    }
                    if (output.match3 < output.match1) {
                        return output.match3Context;
                    }
                    return output.match1Context || output.match2Context || output.match3Context;
                }
            };
            const closestContext = closestContextFn();

            if (!closestContext) {
                const parentHasForbiddenDirection = parentCls.getForbiddenFocusDirections().includes(direction);
                if (parentCls.type === 'screen') {
                    // const nextForcedFocusKey = getNextForcedFocusKey(parentCls, direction, this.contextMap);
                    // if (nextForcedFocusKey) {
                    //     logger.debug('FOUND FORCED FOCUS DIRECTION', direction, nextForcedFocusKey);
                    //     this.focusElementByFocusKey(nextForcedFocusKey);
                    //     return;
                    // }

                    if (!inScreenContext && !parentHasForbiddenDirection) {
                        logger.debug('REACHED END SCREEN.');

                        const focusableScreens: AbstractFocusModel[] = [];
                        const maxOrder = Math.max(
                            ...Object.values(focusableMap).map((o: any) => (isNaN(o.order) ? 0 : o.order))
                        );
                        Object.values(focusableMap).forEach((s: any) => {
                            if (s.type === 'screen' && s.id !== parentCls.id && s.state === SCREEN_STATES.FOREGROUND) {
                                if (s.order >= maxOrder) {
                                    focusableScreens.push(s);
                                }
                            }
                        });

                        logger.debug('FOCUSABLE SCREENS', focusableScreens);
                        let nextScreen: AbstractFocusModel | null | undefined;
                        focusableScreens.forEach((s) => {
                            nextScreen = this.getNextFocusableContext(direction, s, false, true);
                        });

                        // DO NOT SEND EVENTS IF CURRENT SCREEN ALREADY FOCUSED
                        if (nextScreen && nextScreen.id !== currentFocus.id) {
                            currentFocus.getScreen()?.onBlur?.();
                            nextScreen.getScreen()?.onFocus?.();

                            if (nextScreen.getScreen()) {
                                return nextScreen.getScreen()?.getFirstFocusableOnScreen();
                            }
                        }

                        // return nextScreenContext || currentContext;
                        return currentFocus;
                    }
                }

                if (!parentCls) {
                    logger.debug('REACHED NO PARENT.');
                    return currentFocus;
                }

                if (parentHasForbiddenDirection) {
                    logger.debug('PARENT HAS FORBIDDEN DIRECTION', direction);
                    return currentFocus;
                }

                logger.debug('REACHED END. GOING OUT', parentCls);
                if (mustPickContext) {
                    logger.debug('REACHED END OF GROUP. PICKING FIRST CHILD');
                    return currentFocus;
                }

                if (parentCls?.parent) {
                    logger.debug('PICKING PARENT', parentCls.parent);
                    return this.getNextFocusableContext(direction, parentCls.parent, false, false);
                }
                return null;
            }
            if (closestContext.children?.length > 0) {
                logger.debug(`REACHED GROUP ${closestContext.id}. GOING IN`);
                return this.getNextFocusableContext(direction, closestContext, true, false);
            }

            return closestContext || currentFocus;
        }

        return currentFocus;
    };

    public findClosestNode = (cls: AbstractFocusModel, direction: string, output: any) => {
        recalculateLayout(cls);
        const nextLayout = cls.getLayout();
        const currentLayout = this._currentFocus?.layout;
        if (!nextLayout) {
            // eslint-disable-next-line
            logger.warn('LAYOUT OF FOCUSABLE IS NOT MEASURED YET');
            return;
        }
        if (!currentLayout) {
            // eslint-disable-next-line
            logger.warn('Current context were removed during focus find');
            return;
        }

        const currentXCenter = currentLayout.absolute.xCenter;
        const currentYCenter = currentLayout.absolute.yCenter;
        const currentXMin = currentLayout.absolute.xMin;
        const currentXMax = currentLayout.absolute.xMax;
        const currentYMin = currentLayout.absolute.yMin;
        const currentYMax = currentLayout.absolute.yMax;
        const nextXCenter = nextLayout.absolute.xCenter;
        // const cl2cy = cl2.absolute.yCenter;
        const nextXMin = nextLayout.absolute.xMin;
        const nextXMax = nextLayout.absolute.xMax;
        const nextYMin = nextLayout.absolute.yMin;
        const nextYMax = nextLayout.absolute.yMax;

        const contextParameters = {
            currentFocusable: this._currentFocus,
            focusableMap: this._focusableMap,
            isDebuggerEnabled: this._debuggerEnabled,
            findClosestNode: this.findClosestNode,
        };

        switch (direction) {
            case 'swipeLeft':
            case 'left': {
                distCalc(
                    output,
                    cls,
                    this.guideLineY,
                    currentLayout.height,
                    nextYMin, //p3
                    nextYMax, //p4
                    nextXMax, //p5
                    currentXMin, //p6
                    nextXMin, //p7
                    currentXMin, //p8
                    currentYCenter, //p9
                    0,
                    direction,
                    contextParameters
                );
                break;
            }
            case 'swipeRight':
            case 'right': {
                distCalc(
                    output, //
                    cls,
                    this.guideLineY,
                    currentLayout.height,
                    nextYMin, //p3
                    nextYMax, //p4
                    nextXMin, //p5
                    currentXMax, //p6
                    currentXMax, //p7
                    nextXMax, //p8
                    currentYCenter, //p9
                    0,
                    direction,
                    contextParameters
                );
                break;
            }
            case 'swipeUp':
            case 'up': {
                distCalc(
                    output,
                    cls,
                    this.guideLineX,
                    currentLayout.width,
                    nextXMin,
                    nextXMax,
                    nextYMax,
                    currentYMin,
                    nextYMin,
                    currentYMin,
                    nextXCenter,

                    nextXMax,
                    direction,
                    contextParameters
                );
                break;
            }
            case 'swipeDown':
            case 'down': {
                distCalc(
                    output,
                    cls,
                    this.guideLineX,
                    currentLayout.width,
                    nextXMin,
                    nextXMax,
                    nextYMin,
                    currentYMax,
                    currentYMax,
                    nextYMax,
                    currentXCenter,
                    nextXMax,
                    direction,
                    contextParameters
                );
                break;
            }
            default: {
                // Booo
            }
        }

        const currentContext = this.currentContext; // eslint-disable-line prefer-destructuring
        if (currentContext?.parent?.isRecyclable) {
            const d1 = currentContext.parent?.isHorizontal ? ['right', 'swipeRight'] : ['down', 'swipeDown'];
            const d2 = currentContext.parent?.isHorizontal ? ['left', 'swipeLeft'] : ['up', 'swipeUp'];
            const lastIsVisible = d1.includes(direction) ? currentContext.parent?.isLastVisible?.() : true;
            const firstIsVisible = d2.includes(direction) ? currentContext.parent?.isFirstVisible?.() : true;

            if (!lastIsVisible || !firstIsVisible) {
                const closestContext: Context = output.match1Context || output.match2Context || output.match3Context;
                if (!closestContext || closestContext.parent?.id !== currentContext.parent.id) {
                    output.match1Context = currentContext;
                }
            }
        }

        if (currentContext?.parent?.isRecyclable && currentContext.parent.isNested) {
            const d1 = ['down', 'swipeDown'];
            const d2 = ['up', 'swipeUp'];
            const lastIsVisible = d1.includes(direction) ? currentContext.parent?.parent?.isLastVisible?.() : true;
            const firstIsVisible = d2.includes(direction) ? currentContext.parent?.parent?.isFirstVisible?.() : true;

            if (!lastIsVisible || !firstIsVisible) {
                const closestContext: Context = output.match1Context || output.match2Context || output.match3Context;
                if (closestContext && !closestContext?.parent?.isRecyclable) {
                    output.match1Context = currentContext;
                }
            }
        }
    };

    public get isDebuggerEnabled(): boolean {
        return this._debuggerEnabled;
    }

    public set debuggerEnabled(enabled: boolean) {
        this._debuggerEnabled = enabled;
    }

    public get hasPendingUpdateGuideLines(): boolean {
        return this._hasPendingUpdateGuideLines;
    }

    public get contextMap(): { [key: string]: Context } {
        // return this._focusableMap;
    }

    public get guideLineY(): number {
        return this._guideLineY;
    }

    public get guideLineX(): number {
        return this._guideLineX;
    }

    public get currentContext(): Context | null {
        // return this._currentContext;
    }

    public getCurrentFocus(): AbstractFocusModel | null {
        return this._currentFocus;
    }
}

const CoreManagerInstance = new CoreManager();

logger.initialize(CoreManagerInstance);

export default CoreManagerInstance;

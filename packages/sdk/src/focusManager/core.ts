import { findNodeHandle, UIManager } from 'react-native';
import { CONTEXT_TYPES, SCREEN_STATES } from './constants';
import { distCalc, executeScroll as execScroll } from './focusManager';
import { getNextForcedFocusKey } from './helpers';
import { recalculateLayout } from './layoutManager';
import logger from './logger';
import type { Context } from './types';

class CoreManager {
    private _contextMap: {
        [key: string]: Context;
    };

    private _currentContext: Context | null;

    private _debuggerEnabled: boolean;

    private _hasPendingUpdateGuideLines: boolean;

    private _guideLineY: number;

    private _guideLineX: number;

    constructor() {
        this._contextMap = {};
        this._currentContext = null;
        this._debuggerEnabled = false;
        this._hasPendingUpdateGuideLines = false;
        this._guideLineY = 0;
        this._guideLineX = 0;
    }

    public registerContext(context: Context, node?: any) {
        if (this._contextMap[context.id]) {
            return;
        }

        if (node) {
            const nodeId = findNodeHandle(node.current);
            context.nodeId = nodeId;
            context.node = node;
        }

        if (context.type !== CONTEXT_TYPES.SCREEN) {
            let parentContext = context?.parent;
            while (parentContext && parentContext.type !== CONTEXT_TYPES.SCREEN) {
                parentContext = parentContext.parent;
            }
            if (context.initialFocus && !!parentContext) {
                this._contextMap[parentContext.id].initialFocus = context;
            }

            context.screen = parentContext;
        }

        this._contextMap[context.id] = context;
        context.children = [];
        Object.keys(this._contextMap).forEach((k) => {
            const v = this._contextMap[k];
            // Register as parent for children
            if (v.parent && v.parent.id === context.id) {
                context.children.push(v);
            }
            // Register as child in parent
            if (context.parent && context.parent.id === v.id) {
                v.children.push(context);
            }
        });
    }

    public removeContext(context: Context) {
        if (context.children) {
            context.children.forEach((ch: Context) => {
                this.removeContext(ch);
            });
        }

        if (this._currentContext?.id === context.id) {
            this._currentContext = null;
        }
        delete this._contextMap[context.id];
    }

    public removeFromParentContext(context: Context) {
        if (context.parent) {
            context.parent.children.forEach((ch, index) => {
                if (ch.id === context.id) {
                    context.parent?.children.splice(index, 1);
                }
            });
        }
        if (this._currentContext?.id === context.id) {
            this._currentContext = null;
        }
        delete this._contextMap[context.id];
    }

    public executeFocus(direction = '', focusAsNext?: Context) {
        let nextFocusable;
        if (focusAsNext) nextFocusable = focusAsNext;
        else if (this.currentContext?.parent) {
            nextFocusable = focusAsNext || this.getNextFocusableContext(direction, this.currentContext.parent);
        }
        if (nextFocusable) {
            if (nextFocusable.id === this._currentContext?.id) {
                return;
            }

            if (this._currentContext) {
                // @ts-ignore
                UIManager.dispatchViewManagerCommand(this._currentContext.nodeId, 'cmdBlur', null);
                this._currentContext.node.current.onBlur();
                this._currentContext.isFocused = false;
            }

            this._currentContext = nextFocusable;
            // @ts-ignore
            UIManager.dispatchViewManagerCommand(nextFocusable.nodeId, 'cmdFocus', null);
            nextFocusable.node?.current?.onFocus?.();
            nextFocusable.isFocused = true;
            if (nextFocusable.screen) {
                nextFocusable.screen.lastFocused = nextFocusable;
            }
        }
    }

    public executeScroll(direction = '') {
        const contextParameters = {
            currentContext: this._currentContext,
            contextMap: this._contextMap,
            isDebuggerEnabled: this._debuggerEnabled,
        };
        execScroll(direction, contextParameters);
    }

    public executeUpdateGuideLines() {
        if (!this._currentContext?.layout) {
            this._hasPendingUpdateGuideLines = true;
            return;
        }
        if (this._guideLineX !== this._currentContext.layout.absolute.xCenter) {
            this._guideLineX = this._currentContext.layout.absolute.xCenter;
        }
        if (this._guideLineY !== this._currentContext.layout.absolute.yCenter) {
            this._guideLineY = this._currentContext.layout.absolute.yCenter;
        }
        this._hasPendingUpdateGuideLines = false;
    }

    public focusElementByFocusKey = (focusKey: string) => {
        const focusAsNext: Context | undefined = Object.values(this._contextMap).find(
            (s) =>
                s.focusKey === focusKey &&
                (s?.screen?.state === SCREEN_STATES.FOREGROUND || s.state === SCREEN_STATES.FOREGROUND)
        );

        if (focusAsNext?.screen) {
            const nextFocusable = focusAsNext?.screen.screenCls?.getFirstFocusableOnScreen();
            if (nextFocusable) {
                this._currentContext?.screen?.onBlur?.();
                this.executeFocus('', nextFocusable);
                this.executeUpdateGuideLines();
                nextFocusable.screen?.onFocus?.();
            }
        }
    };

    public getNextFocusableContext = (
        direction: string,
        parent: Context,
        mustPickContext?: boolean,
        inScreenContext?: boolean
    ): Context | undefined | null => {
        const currentContext = this._currentContext;
        const contextMap = this._contextMap;

        if (!currentContext) {
            return contextMap[Object.keys(contextMap)[0]];
        }

        const currentContextHasForbiddenDirection = currentContext.forbiddenFocusDirections?.includes(direction);

        if (currentContextHasForbiddenDirection) {
            return currentContext;
        }

        const parentContext = parent;

        // This can happen if we opened new screen which doesn't have any focusable
        // then last screen in context map still keeping focus
        if (parentContext?.state === SCREEN_STATES.BACKGROUND) {
            return currentContext;
        }

        const ch = parentContext?.children;
        const parents = [currentContext.id];
        let p = currentContext?.parent;
        while (p) {
            parents.push(p.id);
            p = p.parent;
        }
        logger.debug('FIND===============================', parents, ch);
        if (ch) {
            const output: {
                match1: number;
                match1IxOffset: number;
                match1Context?: Context;
                match2: number;
                match2IxOffset: number;
                match2Context?: Context;
                match3: number;
                match3IxOffset: number;
                match3Context?: Context;
            } = {
                match1: 999999,
                match1IxOffset: 999999,
                match2: 9999999,
                match2IxOffset: 999999,
                match3: 9999999,
                match3IxOffset: 999999,
            };
            for (let i = 0; i < ch.length; i++) {
                const ctx = ch[i];
                const notFocusableAndNoChildren = ctx.children.length < 1 && !ctx.isFocusable;
                if (notFocusableAndNoChildren) {
                    logger.debug('FOUND GROUP WITH NO CHILDREN!', ctx.id);
                } else if (!parents.includes(ctx.id) && !notFocusableAndNoChildren) {
                    this.findClosestNode(ctx, direction, output);
                }
            }
            const closestContextFn = (): Context | undefined => {
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
                const parentHasForbiddenDirection = parentContext.forbiddenFocusDirections?.includes(direction);
                if (parentContext.type === 'screen') {
                    const nextForcedFocusKey = getNextForcedFocusKey(parentContext, direction, this.contextMap);
                    if (nextForcedFocusKey) {
                        logger.debug('FOUND FORCED FOCUS DIRECTION', direction, nextForcedFocusKey);
                        this.focusElementByFocusKey(nextForcedFocusKey);
                        return;
                    }

                    if (!inScreenContext && !parentHasForbiddenDirection) {
                        logger.debug('REACHED END SCREEN.');

                        const focusableScreens: Context[] = [];
                        const maxOrder = Math.max(
                            ...Object.values(contextMap).map((o: any) => (isNaN(o.order) ? 0 : o.order))
                        );
                        Object.values(contextMap).forEach((s: any) => {
                            if (
                                s.type === 'screen' &&
                                s.id !== parentContext.id &&
                                s.state === SCREEN_STATES.FOREGROUND
                            ) {
                                if (s.order >= maxOrder) {
                                    focusableScreens.push(s);
                                }
                            }
                        });

                        logger.debug('FOCUSABLE SCREENS', focusableScreens);
                        let nextScreenContext: Context | null | undefined;
                        focusableScreens.forEach((s) => {
                            nextScreenContext = this.getNextFocusableContext(direction, s, false, true);
                        });

                        // DO NOT SEND EVENTS IF CURRENT SCREEN ALREADY FOCUSED
                        if (nextScreenContext && nextScreenContext.id !== currentContext.id) {
                            currentContext.screen?.onBlur?.();
                            nextScreenContext.screen?.onFocus?.();

                            if (nextScreenContext.screen) {
                                return nextScreenContext.screen.screenCls?.getFirstFocusableOnScreen();
                            }
                        }

                        // return nextScreenContext || currentContext;
                        return currentContext;
                    }
                }

                if (!parentContext) {
                    logger.debug('REACHED NO PARENT.');
                    return currentContext;
                }

                if (parentHasForbiddenDirection) {
                    logger.debug('PARENT HAS FORBIDDEN DIRECTION', direction);
                    return currentContext;
                }

                logger.debug('REACHED END. GOING OUT', parentContext);
                if (mustPickContext) {
                    logger.debug('REACHED END OF GROUP. PICKING FIRST CHILD');
                    return currentContext;
                }

                if (parentContext?.parent) {
                    logger.debug('PICKING PARENT', parentContext?.parent);
                    return this.getNextFocusableContext(direction, parentContext?.parent, false, false);
                }
                return null;
            }
            if (closestContext.children?.length > 0) {
                logger.debug(`REACHED GROUP ${closestContext.id}. GOING IN`);
                return this.getNextFocusableContext(direction, closestContext, true, false);
            }

            return closestContext || currentContext;
        }

        return currentContext;
    };

    public findClosestNode = (nxt: Context, direction: string, output: any) => {
        recalculateLayout(nxt);
        const nextLayout = nxt.layout;
        const currentLayout = this.currentContext?.layout;
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
            currentContext: this._currentContext,
            contextMap: this._contextMap,
            isDebuggerEnabled: this._debuggerEnabled,
            findClosestNode: this.findClosestNode,
        };

        switch (direction) {
            case 'swipeLeft':
            case 'left': {
                distCalc(
                    output,
                    nxt,
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
                    nxt,
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
                    nxt,
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
                    nxt,
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
        return this._contextMap;
    }

    public get guideLineY(): number {
        return this._guideLineY;
    }

    public get guideLineX(): number {
        return this._guideLineX;
    }

    public get currentContext(): Context | null {
        return this._currentContext;
    }
}

const CoreManagerInstance = new CoreManager();

logger.initialize(CoreManagerInstance);

export default CoreManagerInstance;

import { findNodeHandle, UIManager } from 'react-native';
import { SCREEN_STATES } from './constants';
import { distCalc } from './focusManager';
import { getNextForcedFocusKey } from './helpers';
import { recalculateLayout } from './layoutManager';
import logger from './logger';
import AbstractFocusModel from './Model/AbstractFocusModel';
import { ViewCls } from './Model/view';
import Scroller from './scroller';
import { RecyclerCls } from './Model/recycler';
import { ScreenCls } from './Model/screen';

class CoreManager {
    public _focusMap: {
        [key: string]: AbstractFocusModel;
    };

    public _currentFocus: AbstractFocusModel | null;

    private _debuggerEnabled: boolean;

    private _hasPendingUpdateGuideLines: boolean;

    private _guideLineY: number;

    private _guideLineX: number;

    constructor() {
        this._focusMap = {};

        this._currentFocus = null;

        this._debuggerEnabled = false;
        this._hasPendingUpdateGuideLines = false;
        this._guideLineY = 0;
        this._guideLineX = 0;
    }

    public registerFocusable(cls: AbstractFocusModel, node?: any) {
        if (this._focusMap[cls.getId()]) {
            return;
        }
        if (node) {
            const nodeId = findNodeHandle(node.current);
            cls.nodeId = nodeId;
            cls.node = node;
        }

        this._focusMap[cls.getId()] = cls;

        Object.keys(this._focusMap).forEach((k) => {
            const v = this._focusMap[k];

            // Register as parent for children
            if (v.getParent() && v.getParent()?.getId() === cls.getId()) {
                cls.addChildren(v);
            }
            // Register as child in parent
            if (cls.getParent() && cls.getParent()?.getId() === v.getId()) {
                v.addChildren(cls);
            }
        });
    }

    public removeFocusable(cls: AbstractFocusModel) {
        cls.removeChildrenFromParent();
        delete this._focusMap[cls.getId()];
        if (cls.getId() === this._currentFocus?.getId()) {
            this._currentFocus = null;
        }
    }

    public executeFocus(direction = '', cls?: AbstractFocusModel) {
        let nextFocusable;
        const parent = this._currentFocus?.getParent();
        if (cls) nextFocusable = cls;
        else if (parent) {
            nextFocusable = cls || this.getNextFocusableContext(direction, parent);
        }
        if (nextFocusable) {
            if (nextFocusable.getId() === this._currentFocus?.getId()) {
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
                nextFocusable.getScreen()?.setCurrentFocus(nextFocusable as ViewCls);
            }
        }
    }

    public executeScroll(direction = '') {
        const contextParameters = {
            currentFocus: this._currentFocus,
            focusMap: this._focusMap,
            isDebuggerEnabled: this._debuggerEnabled,
        };
        Scroller.scroll(direction, contextParameters);
    }

    public executeUpdateGuideLines() {
        if (!this._currentFocus?.getLayout()) {
            this._hasPendingUpdateGuideLines = true;
            return;
        }
        if (this._guideLineX !== this._currentFocus.getLayout().absolute.xCenter) {
            this._guideLineX = this._currentFocus.getLayout().absolute.xCenter;
        }
        if (this._guideLineY !== this._currentFocus.getLayout().absolute.yCenter) {
            this._guideLineY = this._currentFocus.getLayout().absolute.yCenter;
        }
        this._hasPendingUpdateGuideLines = false;
    }

    public focusElementByFocusKey = (focusKey: string) => {
        const element: AbstractFocusModel | undefined = Object.values(this._focusMap).find(
            (cls) => cls.getFocusKey() === focusKey && cls.isInForeground()
        );

        if (element && element.isScreen()) {
            element.setFocus((element as ScreenCls).getFirstFocusableOnScreen());
        }
        // TODO: Implement for other type rather than screen
    };

    public getNextFocusableContext = (
        direction: string,
        parent: AbstractFocusModel,
        mustPickContext?: boolean,
        inScreenContext?: boolean
    ): AbstractFocusModel | undefined | null => {
        const currentFocus = this._currentFocus;
        const focusableMap = this._focusMap;

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

        const ch = parentCls.getChildren();
        const parents = [currentFocus.getId()];
        let p = currentFocus?.getParent();
        while (p) {
            parents.push(p.getId());
            p = p.getParent();
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
                const notFocusableAndNoChildren = cls.getChildren().length < 1 && !cls.isFocusable();
                if (notFocusableAndNoChildren) {
                    logger.debug('FOUND GROUP WITH NO CHILDREN!', cls.getId());
                } else if (!parents.includes(cls.getId()) && !notFocusableAndNoChildren) {
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
                if (parentCls.getType() === 'screen') {
                    const nextForcedFocusKey = getNextForcedFocusKey(parentCls, direction, this._focusMap);
                    if (nextForcedFocusKey) {
                        logger.debug('FOUND FORCED FOCUS DIRECTION', direction, nextForcedFocusKey);
                        this.focusElementByFocusKey(nextForcedFocusKey);
                        return;
                    }

                    if (!inScreenContext && !parentHasForbiddenDirection) {
                        logger.debug('REACHED END SCREEN.');

                        const focusableScreens: AbstractFocusModel[] = [];
                        const maxOrder = Math.max(
                            ...Object.values(focusableMap).map((o: AbstractFocusModel) =>
                                isNaN(o.getOrder?.()) ? 0 : o.getOrder?.()
                            )
                        );
                        Object.values(focusableMap).forEach((s: AbstractFocusModel) => {
                            if (
                                s.getType() === 'screen' &&
                                s.getId() !== parentCls.getId() &&
                                s.getState() === SCREEN_STATES.FOREGROUND
                            ) {
                                if (s.getOrder() >= maxOrder) {
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
                        if (nextScreen && nextScreen.getId() !== currentFocus.getId()) {
                            currentFocus.getScreen()?.onBlur?.();
                            nextScreen.getScreen()?.onFocus?.();

                            if (nextScreen.getScreen()) {
                                return nextScreen.getScreen()?.getFirstFocusableOnScreen();
                            }
                        }

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

                const parent = parentCls.getParent();
                if (parent) {
                    logger.debug('PICKING PARENT', parent);
                    return this.getNextFocusableContext(direction, parent, false, false);
                }
                return null;
            }
            if (closestContext.getChildren().length > 0) {
                logger.debug(`REACHED GROUP ${closestContext.getId()}. GOING IN`);
                return this.getNextFocusableContext(direction, closestContext, true, false);
            }

            return closestContext || currentFocus;
        }

        return currentFocus;
    };

    public findClosestNode = (cls: AbstractFocusModel, direction: string, output: any) => {
        recalculateLayout(cls);
        const nextLayout = cls.getLayout();
        const currentLayout = this._currentFocus?.getLayout();
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
            focusableMap: this._focusMap,
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

        if (this._currentFocus?.getParent()?.isRecyclable()) {
            const parent = this._currentFocus.getParent() as RecyclerCls;
            const d1 = parent.isHorizontal() ? ['right', 'swipeRight'] : ['down', 'swipeDown'];
            const d2 = parent.isHorizontal() ? ['left', 'swipeLeft'] : ['up', 'swipeUp'];
            const lastIsVisible = d1.includes(direction) ? parent.isLastVisible?.() : true;
            const firstIsVisible = d2.includes(direction) ? parent.isFirstVisible?.() : true;

            if (!lastIsVisible || !firstIsVisible) {
                const closestContext: AbstractFocusModel =
                    output.match1Context || output.match2Context || output.match3Context;
                if (!closestContext || closestContext.getParent()?.getId() !== parent.getId()) {
                    output.match1Context = this._currentFocus;
                }
            }
        }

        if (this._currentFocus?.getParent()?.isRecyclable()) {
            const parent = this._currentFocus.getParent() as RecyclerCls;
            if (parent.isNested()) {
                const d1 = ['down', 'swipeDown'];
                const d2 = ['up', 'swipeUp'];
                if (parent?.getParent()?.isRecyclable()) {
                    const parentOfParent = parent.getParent() as RecyclerCls;
                    const lastIsVisible = d1.includes(direction) ? parentOfParent.isLastVisible?.() : true;
                    const firstIsVisible = d2.includes(direction) ? parentOfParent.isFirstVisible?.() : true;

                    if (!lastIsVisible || !firstIsVisible) {
                        const closestContext: AbstractFocusModel =
                            output.match1Context || output.match2Context || output.match3Context;
                        if (closestContext && !closestContext?.getParent()?.isRecyclable()) {
                            output.match1Context = this._currentFocus;
                        }
                    }
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

    public get guideLineY(): number {
        return this._guideLineY;
    }

    public get guideLineX(): number {
        return this._guideLineX;
    }

    public getCurrentFocus(): AbstractFocusModel | null {
        return this._currentFocus;
    }

    public getFocusMap(): { [key: string]: AbstractFocusModel } {
        return this._focusMap;
    }
}

const CoreManagerInstance = new CoreManager();

logger.initialize(CoreManagerInstance);

export default CoreManagerInstance;

import { findNodeHandle, UIManager } from 'react-native';
import { distCalc } from '../nextFocusFinder';
import { getNextForcedFocusKey } from '../helpers';
import { recalculateLayout } from '../layoutManager';
import AbstractFocusModel from './AbstractFocusModel';
import Scroller from './scroller';
import View from './view';
import Recycler from './recycler';
import Screen from './screen';
import Logger from './logger';
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

    public executeFocus(cls: AbstractFocusModel) {
        if (cls.getId() === this._currentFocus?.getId()) {
            return;
        }

        if (this._currentFocus) {
            // @ts-ignore
            UIManager.dispatchViewManagerCommand(this._currentFocus.nodeId, 'cmdBlur', null);
            this._currentFocus.onBlur();
            this._currentFocus.setIsFocused(false);
        }

        this._currentFocus = cls;
        // @ts-ignore
        UIManager.dispatchViewManagerCommand(cls.nodeId, 'cmdFocus', null);
        cls.onFocus();
        cls.setIsFocused(true);
        if (cls.getScreen()) {
            cls.getScreen()?.setCurrentFocus(cls as View);
        }
    }

    public executeDirectionalFocus(direction: string) {
        const parent = this._currentFocus?.getParent();
        if (parent) {
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
            const next = this.getNextFocusableContext(direction, parent, output);
            if (next) this.executeFocus(next);
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

        if (element) {
            if (element.isScreen()) {
                element.setFocus((element as Screen).getFirstFocusableOnScreen());
            } else {
                element.setFocus();
            }
        }
    };

    public getNextFocusableContext = (
        direction: string,
        parent: AbstractFocusModel,
        output: any,
        mustPickContext?: boolean,
        inScreenContext?: boolean
    ): AbstractFocusModel | undefined | null => {
        const currentFocus = this._currentFocus;
        const focusMap = this._focusMap;
        
        if (!currentFocus) {
            return focusMap[Object.keys(focusMap)[0]];
        }

        const nextForcedFocusKey = getNextForcedFocusKey(currentFocus, direction, this._focusMap);
        if (nextForcedFocusKey) {
            this.focusElementByFocusKey(nextForcedFocusKey);
            return;
        }

        if (currentFocus.containsForbiddenDirection(direction)) {
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
        Logger.getInstance().debug('FIND===============================', parents, ch);
        if (ch) {
            for (let i = 0; i < ch.length; i++) {
                const cls = ch[i];

                if (cls.getChildren().length > 1) {
                    cls.getChildren().forEach((ch1 => {
                        this.getNextFocusableContext(direction, ch1, output, true, false);
                        // if (ch1.isFocusable() && !parents.includes(ch1.getId())) {
                        //     this.findClosestNode(ch1, direction, output);
                        // }
                    }));
                } else if (cls.isFocusable() && !parents.includes(cls.getId())) {
                    this.findClosestNode(cls, direction, output);
                }
            }

            const closestContext =  output.match1Context || output.match2Context || output.match3Context;

            if (!closestContext) {
                if (parentCls.isScreen()) {
                    const nextForcedFocusKey = getNextForcedFocusKey(parentCls, direction, this._focusMap);
                    if (nextForcedFocusKey) {
                        Logger.getInstance().debug('FOUND FORCED FOCUS DIRECTION', direction, nextForcedFocusKey);
                        this.focusElementByFocusKey(nextForcedFocusKey);
                        return;
                    }

                    if (!inScreenContext && !parentCls.containsForbiddenDirection(direction)) {
                        Logger.getInstance().debug('REACHED END SCREEN.');

                        const focusableScreens: AbstractFocusModel[] = [];
                        const maxOrder = Math.max(
                            ...Object.values(focusMap).map((o: AbstractFocusModel) =>
                                isNaN(o.getOrder?.()) ? 0 : o.getOrder?.()
                            )
                        );
                        Object.values(focusMap).forEach((s: AbstractFocusModel) => {
                            if (s.isScreen() && s.getId() !== parentCls.getId() && s.isInForeground()) {
                                if (s.getOrder() >= maxOrder) {
                                    focusableScreens.push(s);
                                }
                            }
                        });

                        Logger.getInstance().debug('FOCUSABLE SCREENS', focusableScreens);
                        let nextScreen: AbstractFocusModel | null | undefined;
                        focusableScreens.forEach((s) => {
                            nextScreen = this.getNextFocusableContext(direction, s, output, false, true);
                        });

                        Logger.getInstance().debug('FOCUSABLE SCREENS NEXT', nextScreen);

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
                    Logger.getInstance().debug('REACHED NO PARENT.');
                    return currentFocus;
                }

                const nextForcedFocusKey = getNextForcedFocusKey(parentCls, direction, this._focusMap);
                if (nextForcedFocusKey) {
                    this.focusElementByFocusKey(nextForcedFocusKey);
                    return;
                }

                if (parentCls.containsForbiddenDirection(direction)) {
                    Logger.getInstance().debug('PARENT HAS FORBIDDEN DIRECTION', direction);
                    return currentFocus;
                }

                Logger.getInstance().debug('REACHED END. GOING OUT', parentCls);
                if (mustPickContext) {
                    Logger.getInstance().debug('REACHED END OF GROUP. PICKING FIRST CHILD');
                    return currentFocus;
                }

                const parent = parentCls.getParent();
                if (parent) {
                    Logger.getInstance().debug('PICKING PARENT', parent);
                    return this.getNextFocusableContext(direction, parent, output, false, false);
                }
                return null;
            }
            if (closestContext.getChildren().length > 0) {
                Logger.getInstance().debug(`REACHED GROUP ${closestContext.getId()}. GOING IN`);
                return this.getNextFocusableContext(direction, closestContext, output, true, false);
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
            Logger.getInstance().warn('LAYOUT OF FOCUSABLE IS NOT MEASURED YET');
            return;
        }
        if (!currentLayout) {
            // eslint-disable-next-line
            Logger.getInstance().warn('Current context were removed during focus find');
            return;
        }

        const currentXCenter = currentLayout.absolute.xCenter;
        const currentYCenter = currentLayout.absolute.yCenter;
        const currentXMin = currentLayout.absolute.xMin;
        const currentXMax = currentLayout.absolute.xMax;
        const currentYMin = currentLayout.absolute.yMin;
        const currentYMax = currentLayout.absolute.yMax;
        const nextXCenter = nextLayout.absolute.xCenter;
        const nextXMin = nextLayout.absolute.xMin;
        const nextXMax = nextLayout.absolute.xMax;
        const nextYMin = nextLayout.absolute.yMin;
        const nextYMax = nextLayout.absolute.yMax;

        const contextParameters = {
            currentFocus: this._currentFocus,
            focusMap: this._focusMap,
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
                    'left',
                    contextParameters,

                    this._currentFocus as AbstractFocusModel,
                    cls,
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
                    'right',
                    contextParameters,


                    this._currentFocus as AbstractFocusModel,
                    cls,
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
                    'up',
                    contextParameters,

                    this._currentFocus as AbstractFocusModel,
                    cls,

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
                    'down',
                    contextParameters,

                    this._currentFocus as AbstractFocusModel,
                    cls,
                );
                break;
            }
            default: {
                // Booo
            }
        }

        if (this._currentFocus?.getParent()?.isRecyclable()) {
            const parent = this._currentFocus.getParent() as Recycler;
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
            const parent = this._currentFocus.getParent() as Recycler;
            if (parent.isNested()) {
                const d1 = ['down', 'swipeDown'];
                const d2 = ['up', 'swipeUp'];
                if (parent?.getParent()?.isRecyclable()) {
                    const parentOfParent = parent.getParent() as Recycler;
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

Logger.getInstance(CoreManagerInstance);

export default CoreManagerInstance;

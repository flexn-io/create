import { findNodeHandle, UIManager } from 'react-native';
import { distCalc } from '../nextFocusFinder';
import { getNextForcedFocusKey, getDirectionName } from '../helpers';
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
        if (cls.isScreen()) {
            setTimeout(() => {
                this.onScreenRemoved();
            }, 0);
        }
    }

    public onScreenRemoved() {
        const nextScreen = Object.values(this._focusMap).find(
            (c) => c.isInForeground() && c.isScreen() && c.getOrder() === this.getCurrentMaxOrder()
        ) as Screen;

        if (nextScreen) {
            nextScreen.setFocus(nextScreen.getFirstFocusableOnScreen());
        }
    }

    public executeFocus(cls: AbstractFocusModel) {
        if (cls.getId() === this._currentFocus?.getId()) {
            return;
        }

        if (this._currentFocus) {
            if (this._currentFocus.node.current) {
                // @ts-ignore
                UIManager.dispatchViewManagerCommand(this._currentFocus.nodeId, 'cmdBlur', null);
            }
            this._currentFocus.onBlur();
            this._currentFocus.setIsFocused(false);
        }

        this._currentFocus = cls;

        if (cls.node.current) {
            // @ts-ignore
            UIManager.dispatchViewManagerCommand(cls.nodeId, 'cmdFocus', null);
        }
        cls.onFocus();
        cls.setIsFocused(true);

        if (cls.getScreen()) {
            cls.getScreen()?.setCurrentFocus(cls as View);
        }
    }

    public executeDirectionalFocus(direction: string) {
        if (this._currentFocus) {
            if (this._currentFocus.getFocusTaskExecutor(direction)) {
                const focusExecutor = this._currentFocus.getFocusTaskExecutor(direction);
                const next = focusExecutor?.getNextFocusable(direction);
                if (next) this.executeFocus(next);
                return;
            }

            const next = this.getNextFocusableContext(direction);
            if (next) this.executeFocus(next);
        }
    }

    public executeInlineFocus(nextIndex = 0, direction: string) {
        let target: any;
        const parent = this._currentFocus?.getParent();
        if (parent?.isRecyclable() && this._currentFocus) {
            if (['up', 'down'].includes(direction)) {
                const layouts = parent?.isNested() ? parent.getParent()?.getLayouts() : parent?.getLayouts();
                const nextLayout = layouts[nextIndex];
                if (nextLayout) {
                    target = {
                        x: 0,
                        y: nextLayout.y,
                    };
                }
            } else if (['left', 'right'].includes(direction)) {
                const layouts = parent?.getLayouts();
                const nextLayout = layouts[nextIndex];
                if (nextLayout) {
                    target = {
                        x: nextLayout.x,
                        y: nextLayout.y,
                    };
                }
            }

            if (target) {
                Scroller.scrollTo(this._currentFocus, target, direction);
                return target;
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
        ownCandidates?: AbstractFocusModel[]
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

        // This can happen if we opened new screen which doesn't have any focusable
        // then last screen in context map still keeping focus
        if (currentFocus?.isInBackground()) {
            return currentFocus;
        }

        let closestContext: AbstractFocusModel | undefined | null;
        const output: {
            match1: number;
            match1Context?: AbstractFocusModel;
            match2: number;
            match2Context?: AbstractFocusModel;
        } = {
            match1: 9999999,
            match2: 9999999,
        };

        const candidates =
            ownCandidates ??
            Object.values(focusMap).filter(
                (c) =>
                    c.isInForeground() &&
                    c.isFocusable() &&
                    c.getId() !== currentFocus.getId() &&
                    c.getOrder() === this.getCurrentMaxOrder()
            );

        for (let i = 0; i < candidates.length; i++) {
            const cls = candidates[i];

            this.findClosestNode(cls, direction, output);
        }

        closestContext = output.match1Context || output.match2Context;

        if (closestContext) {
            if (closestContext.getParent()?.getId() !== currentFocus.getParent()?.getId()) {
                const parent = currentFocus.getParent() as AbstractFocusModel;

                const nextForcedFocusKey = getNextForcedFocusKey(parent, direction, this._focusMap);
                if (nextForcedFocusKey) {
                    this.focusElementByFocusKey(nextForcedFocusKey);
                    return;
                }

                if (parent.containsForbiddenDirection(direction)) {
                    return currentFocus;
                }

                currentFocus.getParent()?.onBlur();
                closestContext.getParent()?.onFocus();

                if (closestContext.getParent()?.isRecyclable()) {
                    const parent = closestContext.getParent() as Recycler;

                    closestContext = parent.getFocusedView() ?? closestContext;
                }
            }

            if (closestContext.getScreen()?.getId() !== currentFocus.getScreen()?.getId()) {
                currentFocus.getScreen()?.onBlur?.();
                closestContext.getScreen()?.onFocus?.();

                if (closestContext.getScreen()?.getCurrentFocus()) {
                    return closestContext.getScreen()?.getCurrentFocus();
                }
            }

            return closestContext;
        }

        if (this._currentFocus?.getParent()) {
            let parent = this._currentFocus.getParent();
            const parents = parent ? [parent] : [];
            while (parent) {
                parent = parent?.getParent();
                if (parent) {
                    parents.push(parent);
                }
            }

            for (const idx in parents) {
                const p = parents[idx];
                const _nextForcedFocusKey = getNextForcedFocusKey(p, direction, this._focusMap);
                if (_nextForcedFocusKey) {
                    this.focusElementByFocusKey(_nextForcedFocusKey);
                    return;
                }
            }

            for (const idx in parents) {
                const p = parents[idx];
                if (p.containsForbiddenDirection(direction)) {
                    return currentFocus;
                }
            }
        }

        return this._currentFocus;
    };

    public getCurrentMaxOrder(): number {
        return Math.max(...Object.values(this._focusMap).map((o: any) => (isNaN(o.getOrder()) ? 0 : o.getOrder())));
    }

    public findClosestNode = (cls: AbstractFocusModel, direction: string, output: any) => {
        recalculateLayout(cls);
        const nextLayout = cls.getLayout();
        const currentLayout = this._currentFocus?.getLayout();

        if (!nextLayout || !currentLayout) {
            // eslint-disable-next-line
            Logger.getInstance().warn('LAYOUT OF FOCUSABLE IS NOT MEASURED YET');
            return;
        }

        distCalc(output, getDirectionName(direction), this._currentFocus as AbstractFocusModel, cls);
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

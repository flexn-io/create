import { findNodeHandle, UIManager } from 'react-native';
import { isPlatformTizen, isPlatformWebos } from '@rnv/renative';
import { distCalc } from '../nextFocusFinder';
import { getNextForcedFocusKey, getDirectionName } from '../helpers';
import { recalculateLayout } from '../layoutManager';

import Scroller from './scroller';
import Screen from '../model/screen';
import View from '../model/view';
import RecyclerView from '../model/recycler';

import Logger from './logger';
import FocusModel, { TYPE_RECYCLER } from '../model/AbstractFocusModel';
class CoreManager {
    public _focusAwareElements: Record<string, FocusModel>;
    public _views: Record<string, View>;
    public _screens: Record<string, Screen>;

    public _currentFocus: View | null;

    private _debuggerEnabled: boolean;

    private _hasPendingUpdateGuideLines: boolean;

    private _guideLineY: number;

    private _guideLineX: number;

    constructor() {
        this._focusAwareElements = {};
        this._views = {};
        this._screens = {};
        this._currentFocus = null;
        this._debuggerEnabled = false;
        this._hasPendingUpdateGuideLines = false;
        this._guideLineY = 0;
        this._guideLineX = 0;
    }

    public registerFocusAwareComponent(model: FocusModel, node?: any) {
        if (this._focusAwareElements[model.getId()]) {
            return;
        }

        if (model.getNode()) {
            const nodeId = findNodeHandle(model.getNode().current);
            model.nodeId = nodeId;
            // model.node = node;
        }

        this._focusAwareElements[model.getId()] = model;

        if (model instanceof Screen) {
            this._screens[model.getId()] = model as Screen;
        } else if (model instanceof View) {
            this._views[model.getId()] = model as View;
        }

        Object.keys(this._focusAwareElements).forEach((k) => {
            const v = this._focusAwareElements[k];

            // Register as parent for children
            if (v.getParent() && v.getParent()?.getId() === model.getId()) {
                model.addChildren(v);
            }
            // Register as child in parent
            if (model.getParent() && model.getParent()?.getId() === v.getId()) {
                v.addChildren(model);
            }
        });
    }

    public removeFocusAwareComponent(model: FocusModel) {
        model.removeChildrenFromParent();

        delete this._focusAwareElements[model.getId()];
        delete this._views[model.getId()];
        delete this._screens[model.getId()];

        if (model.getId() === this._currentFocus?.getId()) {
            this._currentFocus = null;
        }
    }

    public onScreenRemoved() {
        const screens = Object.values(this._screens).filter(
            (c) => c.isInForeground() && c.getOrder() === this.getCurrentMaxOrder()
        );

        const nextScreen = screens.find((c) => c?.hasStealFocus()) ?? screens[0];

        if (nextScreen) {
            nextScreen.setFocus(nextScreen.getFirstFocusableOnScreen());
        }
    }

    public executeFocus(model: View) {
        if (model.getId() === this._currentFocus?.getId()) {
            return;
        }

        if (this._currentFocus) {
            if (this._currentFocus.node.current && !isPlatformTizen && !isPlatformWebos) {
                // @ts-ignore
                UIManager.dispatchViewManagerCommand(this._currentFocus.nodeId, 'cmdBlur', null);
            }
            this._currentFocus.onBlur();
            this._currentFocus.setIsFocused(false);
        }

        this._currentFocus = model;

        if (model.node.current && !isPlatformTizen && !isPlatformWebos) {
            // @ts-ignore
            UIManager.dispatchViewManagerCommand(model.nodeId, 'cmdFocus', null);
        }
        model.onFocus();
        model.setIsFocused(true);

        if (model.getScreen()) {
            model.getScreen()?.setCurrentFocus(model);
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
            focusMap: this._focusAwareElements,
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
        const view = Object.values(this._views).find(
            (model) => model.getFocusKey() === focusKey && model.isInForeground()
        );

        if (view) {
            view.setFocus();
        } else {
            const screen = Object.values(this._screens).find(
                (model) => model.getFocusKey() === focusKey && model.isInForeground()
            );
            if (screen) {
                screen.setFocus(screen.getFirstFocusableOnScreen());
            }
        }
    };

    public getNextFocusableContext = (
        direction: string,
        ownCandidates?: View[],
        findFocusInParent = true
    ): View | undefined | null => {
        const currentFocus = this._currentFocus;
        const views = this._views;

        if (!currentFocus) {
            return views[Object.keys(views)[0]];
        }

        const nextForcedFocusKey = getNextForcedFocusKey(currentFocus, direction, this._focusAwareElements);
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

        let closestContext: View | undefined | null;
        const output: {
            match1: number;
            match1Context?: View;
            match2: number;
            match2Context?: View;
        } = {
            match1: 9999999,
            match2: 9999999,
        };

        const candidates =
            ownCandidates ??
            Object.values(views).filter(
                (c) =>
                    c.isInForeground() &&
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
                const parent = currentFocus.getParent() as FocusModel;

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

                if (closestContext.getParent()?.getType() === TYPE_RECYCLER) {
                    const parent = closestContext.getParent() as RecyclerView;

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

        if (this._currentFocus?.getParent() && findFocusInParent) {
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
                const _nextForcedFocusKey = getNextForcedFocusKey(p, direction, this._focusAwareElements);
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
        return Math.max(
            ...Object.values(this._focusAwareElements).map((o: any) => (isNaN(o.getOrder()) ? 0 : o.getOrder()))
        );
    }

    public findClosestNode = (model: View, direction: string, output: any) => {
        recalculateLayout(model);
        const nextLayout = model.getLayout();
        const currentLayout = this._currentFocus?.getLayout();

        if (!nextLayout || !currentLayout) {
            // eslint-disable-next-line
            Logger.getInstance().warn('LAYOUT OF FOCUSABLE IS NOT MEASURED YET');
            return;
        }

        if (this._currentFocus) {
            distCalc(output, getDirectionName(direction), this._currentFocus, model);
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

    public getCurrentFocus(): View | null {
        return this._currentFocus;
    }

    public getFocusMap(): { [key: string]: FocusModel } {
        return this._focusAwareElements;
    }

    public getViews(): Record<string, View> {
        return this._views;
    }
}

const CoreManagerInstance = new CoreManager();

Logger.getInstance(CoreManagerInstance);

export default CoreManagerInstance;

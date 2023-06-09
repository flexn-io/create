import { findNodeHandle, UIManager } from 'react-native';
import { isPlatformTizen, isPlatformWebos } from '@rnv/renative';
import { distCalc } from '../nextFocusFinder';
import { recalculateLayout } from '../layoutManager';
import Scroller from './scroller';
import Logger from './logger';
import FocusModel, { TYPE_ROW } from '../model/FocusModel';
import { DIRECTION_DOWN, DIRECTION_LEFT, DIRECTION_RIGHT, DIRECTION_UP, MODEL_TYPES } from '../constants';
import { ClosestNodeOutput, ForbiddenFocusDirections, ScreenType, ViewType } from '../types';
import Row from '../model/row';
class CoreManager {
    public _focusAwareElements: Record<string, FocusModel>;
    public _views: Record<string, ViewType>;
    public _screens: Record<string, ScreenType>;

    public _currentFocus: ViewType | null;

    private _debuggerEnabled: boolean;

    private _pendingLayoutMeasurements: any;

    constructor() {
        this._focusAwareElements = {};
        this._views = {};
        this._screens = {};
        this._currentFocus = null;
        this._debuggerEnabled = false;

        this._pendingLayoutMeasurements = {};
    }

    public setPendingLayoutMeasurement(model: FocusModel, callback?: any) {
        if (this._pendingLayoutMeasurements[model.getId()]) {
            clearTimeout(this._pendingLayoutMeasurements[model.getId()]);
        } else {
            callback();
            this._pendingLayoutMeasurements[model.getId()] = 1;
            return;
        }

        this._pendingLayoutMeasurements[model.getId()] = setTimeout(() => {
            callback();
        }, 100);
    }

    public registerFocusAwareComponent(model: FocusModel) {
        if (this._focusAwareElements[model.getId()]) {
            return;
        }

        if (model.getNode()) {
            const nodeId = findNodeHandle(model.getNode().current);
            model.nodeId = nodeId;
        }

        this._focusAwareElements[model.getId()] = model;

        if (model.getType() === MODEL_TYPES.SCREEN) {
            this._screens[model.getId()] = model as ScreenType;
        } else if (model.getType() === MODEL_TYPES.VIEW) {
            this._views[model.getId()] = model as ViewType;
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

    public executeFocus(model: ViewType) {
        if (model.getId() === this._currentFocus?.getId()) {
            return;
        }

        if (this._currentFocus) {
            if (this._currentFocus.node.current && !isPlatformTizen && !isPlatformWebos) {
                UIManager.dispatchViewManagerCommand(this._currentFocus.nodeId as number, 'cmdBlur', undefined);
            }
            this._currentFocus.onBlur();
            this._currentFocus.setIsFocused(false);
        }

        this._currentFocus = model;

        if (model.node.current && !isPlatformTizen && !isPlatformWebos) {
            UIManager.dispatchViewManagerCommand(model.nodeId as number, 'cmdFocus', undefined);
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

    public executeScroll(direction = '') {
        const contextParameters = {
            currentFocus: this._currentFocus as ViewType,
            focusMap: this._focusAwareElements,
            isDebuggerEnabled: this._debuggerEnabled,
        };
        Scroller.calculateAndScrollToTarget(direction, contextParameters);
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
        ownCandidates?: ViewType[],
        findFocusInParent = true
    ): ViewType | undefined | null => {
        const currentFocus = this._currentFocus;
        const views = this._views;

        if (!currentFocus) {
            return views[Object.keys(views)[0]];
        }

        const nextForcedFocusKey = this.getNextForcedFocusKey(currentFocus, direction);
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

        let closestView: ViewType | undefined | null;
        let closestNodeOutput: ClosestNodeOutput = {
            match1: 9999999,
            match2: 9999999,
            match3: 9999999,
        };

        const candidates =
            ownCandidates ??
            Object.values(views).filter((c) => {
                const group = this.getCurrentFocus()?.getGroup();
                return (
                    c.isInForeground() &&
                    c.getId() !== currentFocus.getId() &&
                    c.getOrder() === this.getCurrentMaxOrder() &&
                    (group ? c?.getGroup() === group : true)
                );
            });

        for (let i = 0; i < candidates.length; i++) {
            const cls = candidates[i];

            const nextOutput = this.findClosestNode(cls, direction, closestNodeOutput);
            if (nextOutput) closestNodeOutput = nextOutput;
        }

        closestView = closestNodeOutput.match1Model || closestNodeOutput.match2Model || closestNodeOutput.match3Model;

        if (closestView) {
            if (closestView.getParent()?.getId() !== currentFocus.getParent()?.getId()) {
                const parent = currentFocus.getParent() as FocusModel;

                const nextForcedFocusKey = this.getNextForcedFocusKey(parent, direction);
                if (nextForcedFocusKey) {
                    this.focusElementByFocusKey(nextForcedFocusKey);
                    return;
                }

                if (parent.containsForbiddenDirection(direction)) {
                    return currentFocus;
                }

                currentFocus.getParent()?.onBlur();
                closestView.getParent()?.onFocus();

                if (closestView.getParent()?.getType() === TYPE_ROW) {
                    const parent = closestView.getParent() as Row;
                    closestView = parent.getLastFocused() ?? closestView;
                }
            }

            if (closestView.getScreen()?.getId() !== currentFocus.getScreen()?.getId()) {
                currentFocus.getScreen()?.onBlur?.();
                closestView.getScreen()?.onFocus?.();

                if (closestView.getScreen()?.getCurrentFocus()) {
                    return closestView.getScreen()?.getCurrentFocus();
                }
            }

            return closestView;
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
                const _nextForcedFocusKey = this.getNextForcedFocusKey(p, direction);
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

    public getNextForcedFocusKey(model: FocusModel, direction: string): string | null {
        let nextFocusDirection;
        switch (true) {
            case DIRECTION_LEFT.includes(direction):
                nextFocusDirection = model.getNextFocusLeft();
                break;
            case DIRECTION_RIGHT.includes(direction):
                nextFocusDirection = model.getNextFocusRight();
                break;
            case DIRECTION_UP.includes(direction):
                nextFocusDirection = model.getNextFocusUp();
                break;
            case DIRECTION_DOWN.includes(direction):
                nextFocusDirection = model.getNextFocusDown();
                break;
            default:
                break;
        }
        return nextFocusDirection ? this.pickActiveForcedFocusContext(nextFocusDirection) : null;
    }

    public pickActiveForcedFocusContext(nextForcedFocusKey: string | string[]): string | null {
        const isActive = (focusKey: string) =>
            Object.values({ ...this._views, ...this._screens }).find(
                (model) => model.getFocusKey() === focusKey && model.isInForeground()
            );

        if (Array.isArray(nextForcedFocusKey)) {
            for (let index = 0; index < nextForcedFocusKey.length; index++) {
                const focusKey = nextForcedFocusKey[index];

                if (isActive(focusKey)) return focusKey;
            }
            return null;
        }

        return isActive(nextForcedFocusKey) ? nextForcedFocusKey : null;
    }

    public getCurrentMaxOrder(): number {
        return Math.max(
            ...Object.values(this._focusAwareElements).map((o: any) => (isNaN(o.getOrder()) ? 0 : o.getOrder()))
        );
    }

    public findClosestNode = (model: ViewType, direction: string, output: any): ClosestNodeOutput | null => {
        recalculateLayout(model);
        const nextLayout = model.getLayout();
        const currentLayout = this._currentFocus?.getLayout();

        if (!nextLayout || !currentLayout) {
            Logger.getInstance().warn('LAYOUT OF FOCUSABLE IS NOT MEASURED YET');
            return null;
        }

        if (this._currentFocus) {
            return distCalc(output, this.getDirectionName(direction), this._currentFocus, model);
        }

        return null;
    };

    public getDirectionName(direction: string) {
        switch (direction) {
            case 'swipeLeft':
            case 'left':
                return 'left';
            case 'swipeRight':
            case 'right':
                return 'right';
            case 'swipeUp':
            case 'up':
                return 'up';
            case 'swipeDown':
            case 'down':
                return 'down';
            default:
                return direction;
        }
    }

    public alterForbiddenFocusDirections(
        forbiddenFocusDirections: ForbiddenFocusDirections[] = []
    ): ForbiddenFocusDirections[] {
        const ffd: ForbiddenFocusDirections[] = [...forbiddenFocusDirections];

        forbiddenFocusDirections.forEach((direction) => {
            if (direction === 'down') ffd.push('swipeDown');
            if (direction === 'up') ffd.push('swipeUp');
            if (direction === 'left') ffd.push('swipeLeft');
            if (direction === 'right') ffd.push('swipeRight');
        });

        return ffd;
    }

    public generateID(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    public get isDebuggerEnabled(): boolean {
        return this._debuggerEnabled;
    }

    public set debuggerEnabled(enabled: boolean) {
        this._debuggerEnabled = enabled;
    }

    public getCurrentFocus(): ViewType | null {
        return this._currentFocus;
    }

    public getFocusMap(): { [key: string]: FocusModel } {
        return this._focusAwareElements;
    }

    public getViews(): Record<string, ViewType> {
        return this._views;
    }
}

const CoreManagerInstance = new CoreManager();

Logger.getInstance(CoreManagerInstance);

export default CoreManagerInstance;

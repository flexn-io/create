import { Platform, UIManager, findNodeHandle } from 'react-native';
import { DIRECTIONS } from '../constants';
import { recalculateAbsolutes } from '../layoutManager';
import FocusModel, { MODEL_TYPES } from '../model/abstractFocusModel';
import { distCalc } from '../nextFocusFinder';
import { ClosestNodeOutput, FocusDirection, ScreenType, ViewGroupType, ViewType } from '../types';
import Logger from './logger';
import Scroller from './scroller';

class CoreManager {
    private _focusAwareElements: Record<string, FocusModel> = {};
    private _views: Record<string, ViewType> = {};
    private _viewGroups: Record<string, ViewGroupType> = {};
    private _screens: Record<string, ScreenType> = {};
    private _currentFocus: ViewType | null = null;
    private _debuggerEnabled = false;
    private _isEnabled = true;
    private _isLongPressEventsEnabled = true;
    private _isTV: boolean | undefined = undefined;
    private _keyEventsEnabled = true;
    private _viewIsAnimating = false;
    private _pendingLayoutMeasurements: Record<string, NodeJS.Timeout | number> = {};

    constructor() {
        const isMobile = !Platform.isTV && (Platform.OS === 'ios' || Platform.OS === 'android');
        const isWeb = Platform.OS === 'web';

        // Disable Focus Manager by default on these platforms
        if (isMobile || isWeb) {
            this._isEnabled = false;
        }
    }

    public setPendingLayoutMeasurement(model: FocusModel, callback: () => void) {
        if (this._pendingLayoutMeasurements[model.getId()]) {
            clearTimeout(this._pendingLayoutMeasurements[model.getId()]);
        } else {
            callback();
            this._pendingLayoutMeasurements[model.getId()] = setTimeout(() => {
                delete this._pendingLayoutMeasurements[model.getId()];
            }, 0);
            return;
        }

        this._pendingLayoutMeasurements[model.getId()] = setTimeout(() => {
            callback();
            delete this._pendingLayoutMeasurements[model.getId()];
        }, 0);
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
        } else if (model.getType() === MODEL_TYPES.VIEW_GROUP) {
            this._viewGroups[model.getId()] = model as ViewGroupType;
        }

        Object.keys(this._focusAwareElements).forEach((k) => {
            const v = this._focusAwareElements[k];

            // Register as parent for children
            if (v && v.getParent() && v.getParent()?.getId() === model.getId()) {
                model.addChildren(v);
            }
            // Register as child in parent
            if (v && model.getParent() && model.getParent()?.getId() === v.getId()) {
                v.addChildren(model);
            }
        });
    }

    public removeFocusAwareComponent(model: FocusModel) {
        model.removeChildrenFromParent();

        delete this._focusAwareElements[model.getId()];
        delete this._views[model.getId()];
        delete this._screens[model.getId()];
        delete this._viewGroups[model.getId()];

        if (model.getId() === this._currentFocus?.getId()) {
            this._currentFocus = null;
        }

        Object.keys(this._viewGroups).forEach((key) => {
            const viewGroup = this._viewGroups[key];
            if (viewGroup?.getCurrentFocus()?.getId() === model.getId()) {
                viewGroup!.setCurrentFocus(null);
            }
        });

        Object.keys(this._screens).forEach((key) => {
            const screen = this._screens[key];
            if (screen?.getCurrentFocus()?.getId() === model.getId()) {
                screen!.setCurrentFocus(null);
            }
        });
    }

    public executeFocus(model: ViewType | null) {
        if (model?.getNode().current) {
            if (model.getId() === this._currentFocus?.getId()) {
                return;
            }

            this.executeEvents(model);

            if (this._currentFocus) {
                if (this._currentFocus.node.current && Platform.OS !== 'web') {
                    UIManager.dispatchViewManagerCommand(this._currentFocus.nodeId as number, 'cmdBlur', undefined);
                }
                this._currentFocus.setIsFocused(false);
            }

            this._currentFocus = model;

            if (model.node.current && Platform.OS !== 'web') {
                UIManager.dispatchViewManagerCommand(model.nodeId as number, 'cmdFocus', undefined);
            }

            model.setIsFocused(true);
            model.getScreen()?.setCurrentFocus(model);
        } else {
            Logger.log('Focusable not found');
        }
    }

    private executeEvents(nextFocus: ViewType) {
        const currentFocus = this._currentFocus;

        currentFocus?.onBlur();
        nextFocus?.onFocus();

        // SCREEN EVENTS
        if (currentFocus?.getScreen()?.getId() !== nextFocus.getScreen()?.getId()) {
            currentFocus?.getScreen()?.onBlur();
            nextFocus.getScreen()?.onFocus();
        }

        // PARENT EVENTS
        if (
            currentFocus?.getParent()?.getId() !== nextFocus.getParent()?.getId() &&
            nextFocus.getParent()?.getType() !== MODEL_TYPES.SCREEN
        ) {
            currentFocus?.getParent()?.onBlur();
            nextFocus.getParent()?.onFocus();
        }
    }

    public executeDirectionalFocus(direction: FocusDirection) {
        if (this._currentFocus) {
            if (this._currentFocus.getFocusTaskExecutor(direction)) {
                const focusExecutor = this._currentFocus.getFocusTaskExecutor(direction);
                const next = focusExecutor?.getNextFocusable(direction);
                if (next?.view) this.executeFocus(next.view);
                if (next?.forcedFocusKey) this.setFocus(next.forcedFocusKey);
                return;
            }
            const { view, forcedFocusKey } = this.getNextFocusableContext(direction);
            if (view) this.executeFocus(view);
            if (forcedFocusKey) this.setFocus(forcedFocusKey);
        }
    }

    public executeScroll(direction: FocusDirection, longPress = false) {
        const contextParameters = {
            currentFocus: this._currentFocus as ViewType,
            focusMap: this._focusAwareElements,
            isDebuggerEnabled: this._debuggerEnabled,
        };
        Scroller.calculateAndScrollToTarget(direction, longPress, contextParameters);
    }

    public setFocus = (focusKey: string, direction?: FocusDirection) => {
        const view = Object.values(this._views).find(
            (model) => model.getFocusKey() === focusKey && model.isInForeground()
        );

        if (view) {
            this.executeFocus(view);
            if (direction) this.executeScroll(direction);
        } else {
            const screen = Object.values(this._screens).find(
                (model) => model.getFocusKey() === focusKey && model.isInForeground()
            );

            if (screen) {
                screen.getFirstFocusableOnScreen().then((view) => {
                    this.executeFocus(view);
                    if (direction) this.executeScroll(direction);
                });
            } else {
                const viewGroup = Object.values(this._viewGroups).find(
                    (model) => model.getFocusKey() === focusKey && model.isInForeground()
                );

                if (viewGroup) {
                    const element = viewGroup.getFirstFocusableInViewGroup(viewGroup);
                    if (element) {
                        this.executeFocus(element);
                        if (direction) this.executeScroll(direction);
                    }
                }
            }
        }
    };

    public setFocusByListOrGridIndex(nextIndex: number) {
        const currentFocus = this._currentFocus;
        if (currentFocus) {
            const layout = currentFocus.getParent()?.getLayouts()[nextIndex];
            const parent = currentFocus.getParent();
            if (layout && parent) {
                const currentIndex = currentFocus.getRepeatContext()?.index as number;
                let direction: FocusDirection | undefined;
                const nextScrollPoint: { x?: number; y?: number } = {};
                if (MODEL_TYPES.GRID === parent.getType()) {
                    direction = currentIndex > nextIndex ? 'up' : 'down';
                    nextScrollPoint.y = layout.y;
                } else if (MODEL_TYPES.ROW === parent.getType()) {
                    if (parent.isHorizontal()) {
                        direction = currentIndex > nextIndex ? 'left' : 'right';
                        nextScrollPoint.x = layout.x;
                    } else {
                        direction = currentIndex > nextIndex ? 'up' : 'down';
                        nextScrollPoint.y = layout.y;
                    }
                }

                if (nextScrollPoint.x !== undefined || nextScrollPoint.y !== undefined) {
                    currentFocus.getParent()?.node.current.scrollTo(nextScrollPoint);
                    const interval = setInterval(() => {
                        const isScrolling = currentFocus?.getParent()?.isScrolling();
                        if (!isScrolling) {
                            const children = currentFocus
                                ?.getParent()
                                ?.getChildren()
                                .find((ch) => ch.getRepeatContext()?.index === nextIndex);
                            if (children) {
                                clearInterval(interval);
                                this.executeFocus(children as ViewType);
                                this.executeScroll(direction!);
                            }
                        }
                    }, 50);
                }
            }
        }
    }

    public getNextFocusableContext = (
        direction: FocusDirection,
        ownCandidates?: ViewType[]
    ): { view: ViewType | null; forcedFocusKey?: string } => {
        const currentFocus = this._currentFocus;
        const views = this._views;

        if (!currentFocus) {
            const firstView = Object.keys(views)[0];
            return { view: firstView ? (views[0] as ViewType) : null };
        }

        const nextForcedFocusKey = this.getNextForcedFocusKey(currentFocus, direction);
        if (nextForcedFocusKey) {
            return { view: null, forcedFocusKey: nextForcedFocusKey };
        }

        if (currentFocus.containsForbiddenDirection(direction)) {
            return { view: this._currentFocus };
        }

        // This can happen if we opened new screen which doesn't have any focusable
        // then last screen in context map still keeping focus
        if (currentFocus?.isInBackground()) {
            return { view: this._currentFocus };
        }

        let closestView: ViewType | null;
        let closestNodeOutput: ClosestNodeOutput = {
            match1: 9999999,
            match1Model: null,
            match2: 9999999,
            match2Model: null,
        };

        const group = this.getCurrentFocus()?.getGroup();

        const candidates =
            ownCandidates ??
            Object.values(views).filter((c) => {
                return (
                    c.isInForeground() &&
                    c.getId() !== currentFocus.getId() &&
                    c.getOrder() === this.getCurrentMaxOrder() &&
                    (group ? c?.getGroup() === group : true)
                );
            });

        for (let i = 0; i < candidates.length; i++) {
            const cls = candidates[i];

            const nextOutput = this.findClosestNode(cls!, direction, closestNodeOutput);
            if (nextOutput) closestNodeOutput = nextOutput;
        }

        closestView = closestNodeOutput.match1Model || closestNodeOutput.match2Model;

        if (closestView) {
            if (closestView.getParent()?.getId() !== currentFocus.getParent()?.getId()) {
                const parent = currentFocus.getParent() as FocusModel;

                const nextForcedFocusKey = this.getNextForcedFocusKey(parent, direction);

                if (nextForcedFocusKey) {
                    return { view: null, forcedFocusKey: nextForcedFocusKey };
                }

                if (closestView.getParent()?.getType() === MODEL_TYPES.ROW) {
                    const parent = closestView.getParent();
                    closestView = parent?.getLastFocused() ?? closestView;
                }

                if (closestView.getParent()?.getType() === MODEL_TYPES.VIEW_GROUP) {
                    const parent = closestView.getParent() as ViewGroupType;
                    closestView = parent?.getCurrentFocus() ?? closestView;
                }

                const parents = currentFocus.getParents(group);

                for (const key in parents) {
                    const p = parents[key];
                    if (p!.containsForbiddenDirection(direction)) {
                        return { view: currentFocus };
                    }
                }
            }

            if (
                closestView.getScreen()?.getId() !== currentFocus.getScreen()?.getId() &&
                closestView.getScreen()?.getCurrentFocus()
            ) {
                return { view: closestView.getScreen()!.getCurrentFocus() };
            }

            return { view: closestView };
        }

        if (this._currentFocus?.getParent()) {
            const parents = this._currentFocus.getParents(group);

            for (const key in parents) {
                const p = parents[key];
                const _nextForcedFocusKey = this.getNextForcedFocusKey(p!, direction);
                if (_nextForcedFocusKey) {
                    return { view: null, forcedFocusKey: _nextForcedFocusKey };
                }
            }

            for (const key in parents) {
                const p = parents[key];
                if (p!.containsForbiddenDirection(direction)) {
                    return { view: currentFocus };
                }
            }
        }

        return { view: currentFocus };
    };

    public getNextForcedFocusKey(model: FocusModel, direction: FocusDirection): string | null {
        let nextFocusDirection;
        switch (direction) {
            case DIRECTIONS.LEFT:
                nextFocusDirection = model.getNextFocusLeft();
                break;
            case DIRECTIONS.RIGHT:
                nextFocusDirection = model.getNextFocusRight();
                break;
            case DIRECTIONS.UP:
                nextFocusDirection = model.getNextFocusUp();
                break;
            case DIRECTIONS.DOWN:
                nextFocusDirection = model.getNextFocusDown();
                break;
            default:
                break;
        }
        return nextFocusDirection ? this.pickActiveForcedFocusContext(nextFocusDirection) : null;
    }

    public pickActiveForcedFocusContext(nextForcedFocusKey: string | string[]): string | null {
        const isActive = (focusKey: string) =>
            Object.values({
                ...this._views,
                ...this._screens,
                ...this._viewGroups,
            }).find((model) => model.getFocusKey() === focusKey && model.isInForeground());

        if (Array.isArray(nextForcedFocusKey)) {
            for (let index = 0; index < nextForcedFocusKey.length; index++) {
                const focusKey = nextForcedFocusKey[index];

                if (focusKey && isActive(focusKey)) return focusKey;
            }
            return null;
        }

        return isActive(nextForcedFocusKey) ? nextForcedFocusKey : null;
    }

    public getCurrentMaxOrder(): number {
        return Math.max(...Object.values(this._screens).map((o) => (isNaN(o.getOrder()) ? 0 : o.getOrder())));
    }

    public findClosestNode = (
        model: ViewType,
        direction: FocusDirection,
        output: ClosestNodeOutput
    ): ClosestNodeOutput | null => {
        // TODO: is this necessary?
        recalculateAbsolutes(model);
        const nextLayout = model.isLayoutMeasured();
        const currentLayout = this._currentFocus?.isLayoutMeasured();

        if (!nextLayout || !currentLayout) {
            Logger.warn('LAYOUT OF FOCUSABLE IS NOT MEASURED YET');
            return null;
        }

        if (this._currentFocus) {
            return distCalc(output, direction, this._currentFocus, model);
        }

        return null;
    };

    public generateID(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    public isDebuggerEnabled() {
        return this._debuggerEnabled;
    }

    public isFocusManagerEnabled() {
        return this._isEnabled;
    }

    public isKeyEventsEnabled() {
        return this._keyEventsEnabled;
    }

    public setDebuggerEnabled(enabled: boolean) {
        this._debuggerEnabled = enabled;
    }

    public setFocusManagerEnabled(enabled: boolean) {
        this._isEnabled = enabled;
    }

    public setKeyEventsEnabled(enabled: boolean) {
        this._keyEventsEnabled = enabled;
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

    public getScreens(): Record<string, ScreenType> {
        return this._screens;
    }

    public getViewGroups(): Record<string, ViewGroupType> {
        return this._viewGroups;
    }

    public setViewIsAnimating(value: boolean) {
        this._viewIsAnimating = value;
    }

    public isViewAnimating(): boolean {
        return this._viewIsAnimating;
    }

    public isTV(): boolean {
        if (this._isTV !== undefined) {
            return this._isTV;
        }

        return Platform.isTV;
    }

    public setIsTV(isTV: boolean) {
        this._isTV = isTV;
    }

    public isLongPressEventEnabled(): boolean {
        return this._isLongPressEventsEnabled;
    }

    public setLongPressEventsEnabled(value: boolean) {
        this._isLongPressEventsEnabled = value;
    }
}

export default new CoreManager();

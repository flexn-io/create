import FocusModel, { MODEL_TYPES } from './abstractFocusModel';
import Event, { EVENT_TYPES } from '../events';
import { CoreManager } from '../..';
import { MutableRefObject } from 'react';
import { ViewGroupProps } from '../types';
import View from './view';
import RecyclerView from './recycler';

class ViewGroup extends FocusModel {
    private _group?: string;
    private _focusKey?: string;
    private _currentFocus: View | null = null;
    private _lastScreenFocus: View | null = null;
    private _allowFocusOutsideGroup = false;

    constructor(
        params: Omit<
            ViewGroupProps & ViewGroupProps['focusOptions'],
            | 'ref'
            | 'focusOptions'
            | 'nextFocusDown'
            | 'nextFocusLeft'
            | 'nextFocusUp'
            | 'nextFocusRight'
        >
    ) {
        super(params);

        const {
            focusContext,
            group,
            focusKey,
            allowFocusOutsideGroup = false,
        } = params;

        const id = CoreManager.generateID(8);
        this._id = focusContext?.getId()
            ? `${focusContext.getId()}:viewGroup-${id}`
            : `viewGroup-${id}`;
        this._parent = focusContext;
        this._type = 'viewGroup';
        this._group = group;
        this._focusKey = focusKey;
        this._allowFocusOutsideGroup = allowFocusOutsideGroup;

        this._onMount = this._onMount.bind(this);
        this._onUnmount = this._onUnmount.bind(this);
        this._onLayout = this._onLayout.bind(this);

        this._events = [
            Event.subscribe(
                this.getType(),
                this.getId(),
                EVENT_TYPES.ON_MOUNT,
                this._onMount
            ),
            Event.subscribe(
                this.getType(),
                this.getId(),
                EVENT_TYPES.ON_UNMOUNT,
                this._onUnmount
            ),
            Event.subscribe(
                this.getType(),
                this.getId(),
                EVENT_TYPES.ON_LAYOUT,
                this._onLayout
            ),
        ];
    }

    // EVENTS
    private _onMount() {
        CoreManager.registerFocusAwareComponent(this);
    }

    private _onUnmount() {
        CoreManager.removeFocusAwareComponent(this);
        this.getScreen()?.setCurrentFocus(this.getLastScreenFocus());
        CoreManager.executeFocus(this.getLastScreenFocus());
        this.setLastScreenFocus(null);
        this.unsubscribeEvents();
    }

    private async _onLayout() {
        this.remeasureSelfAndChildrenLayouts(this);
    }

    // END EVENTS

    public getFirstFocusableInViewGroup = (parent: FocusModel): View | null => {
        if (CoreManager.isFocusManagerEnabled()) {
            if (this._currentFocus) return this._currentFocus;

            let firstChildren = null;

            if (parent.getChildren()?.length > 0) {
                const childrens = parent
                    .getChildren()
                    .filter((child) =>
                        [
                            MODEL_TYPES.ROW,
                            MODEL_TYPES.GRID,
                            MODEL_TYPES.VIEW,
                        ].includes(child.getType() as never)
                    );
                if (childrens && childrens.length > 0) {
                    firstChildren = childrens.reduce((prev, curr) =>
                        prev.getLayout().yMin <= curr.getLayout().yMin &&
                        prev.getLayout().xMin <= curr.getLayout().xMin
                            ? prev
                            : curr
                    );
                } else {
                    if (parent.getChildren()?.length > 0) {
                        return (
                            parent.getChildren().map((child) => {
                                return this.getFirstFocusableInViewGroup(child);
                            })?.[0] ?? null
                        );
                    }
                }

                if (
                    firstChildren &&
                    firstChildren.getType() === MODEL_TYPES.VIEW
                ) {
                    return firstChildren as View;
                } else if (firstChildren) {
                    const recycler = firstChildren as RecyclerView;
                    if (recycler.getFocusedView())
                        return recycler.getFocusedView();
                    return recycler.getInitialFocusableChildren(
                        recycler.getInitialFocusIndex()
                    ) as View | null;
                }
            }
        }

        return null;
    };

    public getGroup() {
        return this._group;
    }

    public setGroup(value?: string): this {
        this._group = value;

        return this;
    }

    public getFocusKey(): string | undefined {
        return this._focusKey;
    }

    public setFocusKey(value?: string): this {
        this._focusKey = value;

        return this;
    }

    public getNode(): MutableRefObject<View> {
        return this.node;
    }

    public setCurrentFocus(model: View | null): this {
        if (!this._lastScreenFocus) {
            this.setLastScreenFocus(
                this.getScreen()?.getCurrentFocus() ?? null
            );
        }
        this._currentFocus = model;

        return this;
    }

    public getCurrentFocus(): View | null {
        return this._currentFocus;
    }

    public setLastScreenFocus(model: View | null): this {
        this._lastScreenFocus = model;

        return this;
    }

    public getLastScreenFocus(): View | null {
        return this._lastScreenFocus;
    }

    public isFocusAllowedOutsideGroup(): boolean {
        return this._allowFocusOutsideGroup;
    }
}

export default ViewGroup;

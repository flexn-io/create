import CoreManager from '../service/core';
import FocusModel, { TYPE_RECYCLER } from './FocusModel';
import Recycler from './recycler';
import ScrollView from './scrollview';
import Event, { EVENT_TYPES } from '../events';
import { measureAsync } from '../layoutManager';
import Row from './row';

class View extends FocusModel {
    private _parentRecyclerView?: Recycler;
    private _parentScrollView?: ScrollView;

    private _isFocused: boolean;
    private _focusKey: string;
    private _hasPreferredFocus: boolean;
    private _verticalContentContainerGap: number;
    private _repeatContext:
        | {
            focusContext: FocusModel;
            index: number;
        }
        | undefined;

    private _onPress?: () => void;

    constructor(params: any) {
        super(params);

        const {
            repeatContext,
            parent,
            forbiddenFocusDirections,
            onFocus,
            onBlur,
            onPress,
            focusKey,
            hasPreferredFocus,
            verticalContentContainerGap = 0
        } = params;

        const id = CoreManager.generateID(8);
        this._id = parent?.getId() ? `${parent.getId()}:view-${id}` : `view-${id}`;
        this._type = 'view';
        this._parent = parent;
        this._isFocused = false;
        this._isFocusable = true;
        this._repeatContext = repeatContext;
        this._focusKey = focusKey;
        this._forbiddenFocusDirections = CoreManager.alterForbiddenFocusDirections(forbiddenFocusDirections);
        this._hasPreferredFocus = hasPreferredFocus;
        this._verticalContentContainerGap = verticalContentContainerGap;

        this._onFocus = onFocus;
        this._onBlur = onBlur;
        this._onPress = onPress;

        this._onMount = this._onMount.bind(this);
        this._onUnmount = this._onUnmount.bind(this);
        this._onLayout = this._onLayout.bind(this);

        this._events = [
            Event.subscribe(this, EVENT_TYPES.ON_MOUNT, this._onMount),
            Event.subscribe(this, EVENT_TYPES.ON_UNMOUNT, this._onUnmount),
            Event.subscribe(this, EVENT_TYPES.ON_LAYOUT, this._onLayout),
        ];

        this.init();
    }

    private init() {
        if (this.getParent()?.getType() === TYPE_RECYCLER) {
            const parent = this.getParent() as Recycler;
            if (parent.getInitialRenderIndex() && parent.getInitialRenderIndex() === this.getRepeatContext()?.index) {
                parent.setFocusedView(this);
            } else if (!parent.getFocusedView() && this.getRepeatContext()?.index === 0) {
                parent.setFocusedView(this);
            }
        }
    }

    // EVENTS
    private _onMount() {
        CoreManager.registerFocusAwareComponent(this);
        const screen = this.getScreen();
        if (screen) {
            screen.addComponentToPendingLayoutMap(this.getId());
            if (this.hasPreferredFocus()) screen.setPreferredFocus(this);
        }
    }

    private _onUnmount() {
        CoreManager.removeFocusAwareComponent(this);
        this.getScreen()?.onViewRemoved(this);
        this.unsubscribeEvents();
    }

    private async _onLayout() {
        await measureAsync({ model: this });
        this.getScreen()?.removeComponentFromPendingLayoutMap(this.getId());
    }

    // END EVENTS

    public onFocus(): void {
        const parent = this.getParent();

        if (this._onFocus) {
            this._onFocus();
        }
        if (parent instanceof Row) {
            parent.setFocusedView(this);
        }
    }

    public isFocusable(): boolean {
        return true;
    }

    public updateEvents({ onPress, onFocus, onBlur }: any) {
        this._onPress = onPress;
        this._onFocus = onFocus;
        this._onBlur = onBlur;

        return this;
    }

    public setFocus() {
        CoreManager.executeFocus(this);
    }

    public onPress(): void {
        if (this._onPress) {
            this._onPress();
        }
    }

    public setIsFocused(value: boolean): this {
        this._isFocused = value;

        if (value && this.getParent()?.getType() === TYPE_RECYCLER) {
            const currentIndex = this.getRepeatContext()?.index;
            if (currentIndex !== undefined) {
                (this.getParent() as Recycler).setFocusedIndex(currentIndex).setFocusedView(this);
            }
        }

        return this;
    }

    public getIsFocused(): boolean {
        return this._isFocused;
    }

    public setRepeatContext(value: any): this {
        this._repeatContext = value;

        return this;
    }

    public getRepeatContext(): { focusContext: FocusModel; index: number } | undefined {
        return this._repeatContext;
    }

    public getFocusKey(): string {
        return this._focusKey;
    }

    public hasPreferredFocus(): boolean {
        return this._hasPreferredFocus;
    }

    public setParentRecyclerView(recyclerView: Recycler) {
        this._parentRecyclerView = recyclerView;

        return this;
    }

    public getParentRecyclerView(): Recycler | undefined {
        return this._parentRecyclerView;
    }

    public setParentScrollView(scrollView: ScrollView) {
        this._parentScrollView = scrollView;

        return this;
    }

    public getParentScrollView(): ScrollView | undefined {
        return this._parentScrollView;
    }

    public verticalContentContainerGap(): number {
        return this._verticalContentContainerGap;
    }
}

export default View;

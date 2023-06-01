import AbstractFocusModel from './FocusModel';
import { ForbiddenFocusDirections } from '../types';
import View from './view';
import Event, { EVENT_TYPES } from '../events';
import { CoreManager } from '../..';
import { measureAsync } from '../layoutManager';

class RecyclerView extends AbstractFocusModel {
    private _layouts: { x: number; y: number }[];
    private _layoutsReady: boolean;
    private _scrollOffsetX: number;
    private _scrollOffsetY: number;
    private _isNested: boolean;
    private _isHorizontal: boolean;
    private _focusedIndex: number;
    private _initialRenderIndex: number;
    private _focusedView?: View;
    private _repeatContext:
        | {
              focusContext: AbstractFocusModel;
              index: number;
          }
        | undefined;

    private _scrollerNode?: any;

    constructor(params: any) {
        super(params);

        const {
            isHorizontal,
            isNested,
            parent,
            repeatContext,
            forbiddenFocusDirections,
            onFocus,
            onBlur,
            initialRenderIndex = 0,
        } = params;

        this._layoutsReady = false;
        this._id = `recycler-${CoreManager.generateID(8)}`;
        this._type = 'recycler';
        this._layouts = [];
        this._isScrollable = true;
        this._scrollOffsetX = 0;
        this._scrollOffsetY = 0;
        this._isNested = isNested;
        this._isHorizontal = isHorizontal;
        this._parent = parent;
        this._repeatContext = repeatContext;
        this._forbiddenFocusDirections = CoreManager.alterForbiddenFocusDirections(forbiddenFocusDirections);
        this._focusedIndex = 0;
        this._initialRenderIndex = initialRenderIndex;

        this._onFocus = onFocus;
        this._onBlur = onBlur;

        this._onMountAndMeasured = this._onMountAndMeasured.bind(this);
        this._onUnmount = this._onUnmount.bind(this);
        this._onLayout = this._onLayout.bind(this);

        this._events = [
            Event.subscribe(this, EVENT_TYPES.ON_MOUNT_AND_MEASURED, this._onMountAndMeasured),
            Event.subscribe(this, EVENT_TYPES.ON_UNMOUNT, this._onUnmount),
            Event.subscribe(this, EVENT_TYPES.ON_LAYOUT, this._onLayout),
        ];
    }

    // EVENTS
    protected _onMountAndMeasured() {
        CoreManager.registerFocusAwareComponent(this);
    }

    protected _onUnmount() {
        CoreManager.removeFocusAwareComponent(this);
        this.unsubscribeEvents();
    }

    protected async _onLayout() {
        await measureAsync({ model: this });
        Event.emit(this, EVENT_TYPES.ON_LAYOUT_MEASURE_COMPLETED);
    }

    // END EVENTS

    public getLayouts(): { x: number; y: number }[] {
        return this._layouts;
    }

    public updateLayouts(layouts: { x: number; y: number }[] | undefined) {
        if (layouts && this._layouts.length !== layouts.length) {
            this._layouts = layouts;

            if (!this._layoutsReady) {
                if (this.getInitialRenderIndex()) {
                    this.scrollToInitialRenderIndex();
                }
            }

            this._layoutsReady = true;

            const repeatLayout = layouts[layouts.length - 1];
            this.updateLayoutProperty('xMaxScroll', this.getLayout().xMax + repeatLayout.x).updateLayoutProperty(
                'yMaxScroll',
                this.getLayout().yMax + repeatLayout.y
            );
        }

        return this;
    }

    public isNested(): boolean {
        return this._isNested;
    }

    public isHorizontal(): boolean {
        return this._isHorizontal;
    }

    public setScrollOffsetX(value: number): this {
        this._scrollOffsetX = value;

        return this;
    }

    public getScrollOffsetX(): number {
        return this._scrollOffsetX;
    }

    public setScrollOffsetY(value: number): this {
        this._scrollOffsetY = value;

        return this;
    }

    public getScrollOffsetY(): number {
        return this._scrollOffsetY;
    }

    public setRepeatContext(value: any): this {
        this._repeatContext = value;

        return this;
    }

    public getRepeatContext(): { focusContext: AbstractFocusModel; index: number } | undefined {
        return this._repeatContext;
    }

    public getForbiddenFocusDirections(): ForbiddenFocusDirections[] {
        return this._forbiddenFocusDirections;
    }

    public setFocusedIndex(index: number): this {
        this._focusedIndex = index;

        return this;
    }

    public getFocusedIndex(): number {
        return this._focusedIndex;
    }

    public setFocusedView(view?: View): this {
        this._focusedView = view;

        return this;
    }

    public getInitialRenderIndex(): number {
        return this._initialRenderIndex;
    }

    public getFocusedView(): View | undefined {
        return this._focusedView;
    }

    public scrollToInitialRenderIndex(): void {
        //TODO: implement
    }

    public isScrollingVertically(): boolean {
        return false;
    }

    public isScrollingHorizontally(): boolean {
        return false;
    }

    public verticalContentContainerGap(): number {
        return 0;
    }

    public setScrollerNode(node: any) {
        this._scrollerNode = node;
    }
}

export default RecyclerView;

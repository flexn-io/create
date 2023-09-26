import { ScrollView } from 'react-native';
import FocusModel from './abstractFocusModel';
import { FlashListProps, ForbiddenFocusDirections } from '../types';
import View from './view';
import Event, { EVENT_TYPES } from '../events';
import { CoreManager } from '../..';
import { measureAsync } from '../layoutManager';
import { MutableRefObject } from 'react';
import { Ratio } from '../../helpers';

class RecyclerView extends FocusModel {
    private _layouts: { x: number; y: number; width: number; height: number }[];
    private _layoutsReady: boolean;
    private _scrollOffsetX: number;
    private _scrollOffsetY: number;
    private _scrollTargetY?: number;
    private _scrollTargetX?: number;
    private _isHorizontal: boolean;
    private _focusedIndex: number;
    private _initialRenderIndex: number;
    private _focusedView: View | null = null;
    private _isScrollingHorizontally: boolean;
    private _isScrollingVertically: boolean;
    private _autoLayoutScaleAnimation = false;
    private _autoLayoutSize = 0;
    private _listHeaderDimensions = { width: 0, height: 0 };

    constructor(
        params: Omit<
            FlashListProps<any> & FlashListProps<any>['focusOptions'],
            'style' | 'scrollViewProps' | 'renderItem' | 'type' | 'data' | 'focusOptions'
        >
    ) {
        super(params);

        const {
            horizontal = true,
            focusContext,
            forbiddenFocusDirections = [],
            onFocus,
            onBlur,
            initialRenderIndex = 0,
            autoLayoutSize = 0,
            listHeaderDimensions = { width: 0, height: 0 },
            autoLayoutScaleAnimation = false,
        } = params;

        this._layoutsReady = false;
        this._id = `recycler-${CoreManager.generateID(8)}`;
        this._type = 'recycler';
        this._layouts = [];
        this._isScrollable = true;
        this._scrollOffsetX = 0;
        this._scrollOffsetY = 0;
        this._isHorizontal = horizontal;
        this._parent = focusContext;
        this._forbiddenFocusDirections = forbiddenFocusDirections;
        this._focusedIndex = 0;
        this._initialRenderIndex = initialRenderIndex;
        this._isScrollingHorizontally = false;
        this._isScrollingVertically = false;
        this._autoLayoutScaleAnimation = autoLayoutScaleAnimation;
        this._autoLayoutSize = autoLayoutSize;
        this._listHeaderDimensions = listHeaderDimensions;

        this._onFocus = onFocus;
        this._onBlur = onBlur;

        this._onMountAndMeasured = this._onMountAndMeasured.bind(this);
        this._onUnmount = this._onUnmount.bind(this);
        this._onLayout = this._onLayout.bind(this);

        this._events = [
            Event.subscribe(this.getType(), this.getId(), EVENT_TYPES.ON_MOUNT_AND_MEASURED, this._onMountAndMeasured),
            Event.subscribe(this.getType(), this.getId(), EVENT_TYPES.ON_UNMOUNT, this._onUnmount),
            Event.subscribe(this.getType(), this.getId(), EVENT_TYPES.ON_LAYOUT, this._onLayout),
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
        this.remeasureChildrenLayouts(this);
        Event.emit(this.getType(), this.getId(), EVENT_TYPES.ON_LAYOUT_MEASURE_COMPLETED);
    }

    // END EVENTS

    public getLayouts(): { x: number; y: number; width: number; height: number }[] {
        return this._layouts;
    }

    public updateLayouts(layouts: { x: number; y: number; width: number; height: number }[] | undefined) {
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

    public setScrollTargetX(value: number): this {
        this._scrollTargetX = value;

        return this;
    }

    public setScrollTargetY(value: number): this {
        this._scrollTargetY = value;

        return this;
    }

    public getScrollTargetY(): number | undefined {
        return this._scrollTargetY;
    }

    public getScrollTargetX(): number | undefined {
        return this._scrollTargetX;
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

    public setFocusedView(view: View | null): this {
        this._focusedView = view;

        return this;
    }

    public getInitialRenderIndex(): number {
        return this._initialRenderIndex;
    }

    public getFocusedView(): View | null {
        return this._focusedView;
    }

    public scrollToInitialRenderIndex(): void {
        //TODO: implement
    }

    public setIsScrollingHorizontally(value: boolean): this {
        this._isScrollingHorizontally = value;

        return this;
    }

    public setIsScrollingVertically(value: boolean): this {
        this._isScrollingVertically = value;

        return this;
    }

    public isScrollingVertically(): boolean {
        return this._isScrollingVertically;
    }

    public isScrollingHorizontally(): boolean {
        return this._isScrollingHorizontally;
    }

    public verticalContentContainerGap(): number {
        return 0;
    }

    public isAutoLayoutScaleAnimationEnabled(): boolean {
        return this._autoLayoutScaleAnimation;
    }

    public getAutoLayoutSize(): number {
        // TODO: Needs to be calculated
        if (this._autoLayoutScaleAnimation) {
            return Ratio(this._autoLayoutSize);
        }

        return 0;
    }

    public getNode(): MutableRefObject<ScrollView> {
        return this.node;
    }

    public getListHeaderDimensions(): { width: number; height: number } {
        return this._listHeaderDimensions;
    }

    public updateEvents({ onFocus, onBlur }: { onPress?(): void; onFocus?(): void; onBlur?(): void }) {
        this._onFocus = onFocus;
        this._onBlur = onBlur;

        return this;
    }
}

export default RecyclerView;

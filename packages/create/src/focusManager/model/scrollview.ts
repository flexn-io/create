import { ScrollView as RNScrollView } from 'react-native';
import FocusModel from './abstractFocusModel';
import Event, { EVENT_TYPES } from '../events';
import { CoreManager } from '../..';
import { measureAsync } from '../layoutManager';
import { MutableRefObject } from 'react';
import { ScrollViewProps } from '../types';

class ScrollView extends FocusModel {
    private _scrollOffsetX: number;
    private _scrollOffsetY: number;
    private _scrollTargetY?: number;
    private _scrollTargetX?: number;
    private _isHorizontal: boolean;
    private _isScrollingHorizontally: boolean;
    private _isScrollingVertically: boolean;

    constructor(
        params: Omit<
            ScrollViewProps & ScrollViewProps['focusOptions'],
            'style' | 'scrollViewProps' | 'renderItem' | 'type' | 'data' | 'focusOptions'
        >
    ) {
        super(params);

        const { horizontal = false, focusContext } = params;

        this._id = `scroll-${CoreManager.generateID(8)}`;
        this._isHorizontal = horizontal as boolean;
        this._parent = focusContext;
        this._type = 'scrollview';
        this._scrollOffsetX = 0;
        this._scrollOffsetY = 0;
        this._isScrollable = true;
        this._isScrollingHorizontally = false;
        this._isScrollingVertically = false;

        this._onMount = this._onMount.bind(this);
        this._onUnmount = this._onUnmount.bind(this);
        this._onLayout = this._onLayout.bind(this);

        this._events = [
            Event.subscribe(this.getType(), this.getId(), EVENT_TYPES.ON_MOUNT, this._onMount),
            Event.subscribe(this.getType(), this.getId(), EVENT_TYPES.ON_UNMOUNT, this._onUnmount),
            Event.subscribe(this.getType(), this.getId(), EVENT_TYPES.ON_LAYOUT, this._onLayout),
        ];
    }

    // EVENTS
    private _onMount() {
        CoreManager.registerFocusAwareComponent(this);
    }

    private _onUnmount() {
        CoreManager.removeFocusAwareComponent(this);
        this.unsubscribeEvents();
    }

    private async _onLayout() {
        await measureAsync({ model: this });
        this.remeasureChildrenLayouts(this);
    }

    // END EVENTS

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

    public isHorizontal(): boolean {
        return this._isHorizontal;
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

    public getNode(): MutableRefObject<RNScrollView> {
        return this.node;
    }
}

export default ScrollView;

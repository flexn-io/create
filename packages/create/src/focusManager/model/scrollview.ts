import AbstractFocusModel from './FocusModel';
import Event, { EVENT_TYPES } from '../events';
import { CoreManager } from '../..';
import { measureAsync } from '../layoutManager';

class ScrollView extends AbstractFocusModel {
    private _scrollOffsetX: number;
    private _scrollOffsetY: number;
    private _isHorizontal: boolean;
    private _isScrollingHorizontally: boolean;
    private _isScrollingVertically: boolean;

    constructor(params: any) {
        super(params);

        const { horizontal, parent } = params;

        this._id = `scroll-${CoreManager.generateID(8)}`;
        this._isHorizontal = horizontal;
        this._parent = parent;
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
            Event.subscribe(this, EVENT_TYPES.ON_MOUNT, this._onMount),
            Event.subscribe(this, EVENT_TYPES.ON_UNMOUNT, this._onUnmount),
            Event.subscribe(this, EVENT_TYPES.ON_LAYOUT, this._onLayout),
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
}

export default ScrollView;

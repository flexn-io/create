import { makeid } from '../helpers';
import AbstractFocusModel from './AbstractFocusModel';

class ScrollView extends AbstractFocusModel {
    private _scrollOffsetX: number;
    private _scrollOffsetY: number;
    private _isHorizontal: boolean;

    constructor(params: any) {
        super(params);

        const { horizontal, parent } = params;

        this._id = `scroll-${makeid(8)}`;
        this._isHorizontal = horizontal;
        this._parent = parent;
        this._type = 'scrollview';
        this._scrollOffsetX = 0;
        this._scrollOffsetY = 0;
        this._isScrollable = true;
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

    public isHorizontal(): boolean {
        return this._isHorizontal;
    }
}

export default ScrollView;

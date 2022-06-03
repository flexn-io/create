import { makeid } from '../helpers';
import AbstractFocusModel from './AbstractFocusModel';

export class ScrollView extends AbstractFocusModel {
    private _type: string;

    public _parent?: AbstractFocusModel;
    public _initialFocus?: AbstractFocusModel;
    public _layouts: any;

    public _scrollOffsetX: number;
    public _scrollOffsetY: number;
    public _isHorizontal: boolean;
    public _isFocusable: boolean;
    public _isScrollable: boolean;

    constructor(params: any) {
        super();

        const { horizontal, parent } = params;

        this._id = `scroll-${makeid(8)}`;
        this._isHorizontal = horizontal;
        this._parent = parent;
        this._type = 'scrollview';
        this._scrollOffsetX = 0;
        this._scrollOffsetY = 0;
        this._isFocusable = false;
        this._isScrollable = true;
    }

    public destroy(): void {
        destroyInstance(this._id);
    }

    public getType(): string {
        return this._type;
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

    public isScrollable(): boolean {
        return true;
    }

    public isHorizontal(): boolean {
        return this._isHorizontal;
    }

    public getParent(): AbstractFocusModel | undefined {
        return this._parent;
    }

    public setRepeatContext(_value: any): this {
        return this;
    }

    public getRepeatContext(): { parentContext: AbstractFocusModel; index: number } | undefined {
        return;
    }
}

const ScrollViewInstances: { [key: string]: ScrollView } = {};
function createInstance(context: any) {
    if (ScrollViewInstances[context.id]) {
        return ScrollViewInstances[context.id];
    }

    const _ScrollView = new ScrollView(context);
    ScrollViewInstances[_ScrollView.getId()] = _ScrollView;

    return ScrollViewInstances[_ScrollView.getId()];
}

function destroyInstance(id: string) {
    if (ScrollViewInstances[id]) {
        delete ScrollViewInstances[id];
    }
}

export type ScrollViewCls = ScrollView;

export { createInstance, destroyInstance };

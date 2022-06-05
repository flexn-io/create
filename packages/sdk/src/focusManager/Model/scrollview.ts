import { makeid } from '../helpers';
import AbstractFocusModel from './AbstractFocusModel';

export class ScrollView extends AbstractFocusModel {
    private _type: string;

    private _parent?: AbstractFocusModel;
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

    public isFocusable(): boolean {
        return false;
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

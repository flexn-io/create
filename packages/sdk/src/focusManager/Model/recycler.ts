import { makeid } from '../helpers';
import AbstractFocusModel from './AbstractFocusModel';
import { ForbiddenFocusDirections } from '../types';
import { alterForbiddenFocusDirections } from '../../focusManager/helpers';

export class Recycler extends AbstractFocusModel {
    private _type: string;

    public _parent?: AbstractFocusModel;
    public _initialFocus?: AbstractFocusModel;
    public _layouts: any;

    public _scrollOffsetX: number;
    public _scrollOffsetY: number;
    public _isNested: boolean;
    public _isHorizontal: boolean;
    public _forbiddenFocusDirections: ForbiddenFocusDirections[];

    public _repeatContext:
        | {
              parentContext: AbstractFocusModel;
              index: number;
          }
        | undefined;

    public isLastVisible?: () => boolean;
    public isFirstVisible?: () => boolean;

    constructor(params: any) {
        super();

        const { isHorizontal, isNested, parent, repeatContext, forbiddenFocusDirections } = params;

        this._id = `recycler-${makeid(8)}`;
        this._type = 'recycler';
        this._layouts = [];
        this._scrollOffsetX = 0;
        this._scrollOffsetY = 0;
        this._isNested = isNested;
        this._isHorizontal = isHorizontal;
        this._parent = parent;
        this._repeatContext = repeatContext;
        this._forbiddenFocusDirections = alterForbiddenFocusDirections(forbiddenFocusDirections);
    }

    public getType(): string {
        return this._type;
    }

    public destroy(): void {
        destroyInstance(this._id);
    }

    public isFocusable(): boolean {
        return false;
    }

    public getLayouts(): [] {
        return this._layouts;
    }

    public setLayouts(layouts: any) {
        this._layouts = layouts;

        return this;
    }

    public isScrollable(): boolean {
        return true;
    }

    public isRecyclable(): boolean {
        return true;
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

    public getParent(): AbstractFocusModel | undefined {
        return this._parent;
    }

    public setRepeatContext(value: any): this {
        this._repeatContext = value;

        return this;
    }

    public getRepeatContext(): { parentContext: AbstractFocusModel; index: number } | undefined {
        return this._repeatContext;
    }
}

const RecyclerInstances: { [key: string]: Recycler } = {};
function createInstance(context: any): Recycler {
    const _Recycler = new Recycler(context);
    RecyclerInstances[_Recycler.getId()] = _Recycler;

    return RecyclerInstances[_Recycler.getId()];
}

function destroyInstance(id: string) {
    if (RecyclerInstances[id]) {
        delete RecyclerInstances[id];
    }
}

export type RecyclerCls = Recycler;

export { createInstance, destroyInstance };

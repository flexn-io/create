import { makeid } from '../helpers';
import AbstractFocusModel from './AbstractFocusModel';
import { ScreenCls } from './screen';

class Recycler extends AbstractFocusModel {
    public id: string;
    public children: AbstractFocusModel[];
    public repeatContext?: {
        parentContext: AbstractFocusModel;
        index: number;
    };
    public parent?: AbstractFocusModel;
    public initialFocus?: AbstractFocusModel;
    public type: string;
    public layouts: any;
    public screen?: ScreenCls;

    public scrollOffsetX: number;
    public scrollOffsetY: number;
    public isNested: boolean;
    public _isHorizontal: boolean;

    public isLastVisible?: () => boolean;
    public isFirstVisible?: () => boolean;

    constructor(params: any) {
        super();

        this.id = '';
        this.type = 'recycler';
        this.children = [];
        this.layouts = [];
        this.scrollOffsetX = 0;
        this.scrollOffsetY = 0;
        this.isNested = false;
        this._isHorizontal = true;

        this.createContext(params);
    }

    public destroy(): void {
        destroyInstance(this.id);
    }

    private createContext(params: any) {
        const id = makeid(8);

        this.id = `recycler-${id}`;
        this.type = 'recycler';
        this.parent = params.parent;
        this.isNested = params.isNested;
        this._isHorizontal = params.isHorizontal;
    }

    public updateContext(params: any) {
        this.createContext(params);
    }

    public isFocusable(): boolean {
        return false;
    }

    public getLayouts(): [] {
        return this.layouts;
    }

    public setLayouts(layouts: any) {
        this.layouts = layouts;

        return this;
    }

    public setScreen(cls: ScreenCls): this {
        this.screen = cls;

        return this;
    }

    public getScreen(): ScreenCls | undefined {
        return this.screen;
    }

    public isScrollable(): boolean {
        return true;
    }

    public isRecyclable(): boolean {
        return true;
    }

    public setRepeatContext(value: any): this {
        this.repeatContext = value;

        return this;
    }

    public isHorizontal(): boolean {
        return this._isHorizontal;
    }
}

const RecyclerInstances: { [key: string]: Recycler } = {};
function createOrReturnInstance(context: any) {
    if (RecyclerInstances[context.id]) {
        return RecyclerInstances[context.id];
    }

    const _Recycler = new Recycler(context);
    RecyclerInstances[_Recycler.id] = _Recycler;

    return RecyclerInstances[_Recycler.id];
}

function destroyInstance(id: string) {
    if (RecyclerInstances[id]) {
        delete RecyclerInstances[id];
    }
}

export type RecyclerCls = Recycler;

export { createOrReturnInstance, destroyInstance };

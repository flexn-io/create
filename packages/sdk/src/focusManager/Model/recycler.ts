import { Context } from '../types';
import { makeid } from '../helpers';
import AbstractFocusModel from './AbstractFocusModel';

class Recycler extends AbstractFocusModel {
    public context: any;

    public id: string;
    public children: AbstractFocusModel[];
    public parentContext: AbstractFocusModel;
    public repeatContext: AbstractFocusModel;
    public parent?: AbstractFocusModel;
    public initialFocus?: AbstractFocusModel;
    public type: string;

    constructor(params: any) {
        super();
        this.context = {};

        this.children = [];
        this.parentContext = this;
        this.repeatContext = this;
        this.type = '';
        this.id = '';

        this.createContext(params);
    }

    public setScreen(_cls: AbstractFocusModel): this {
        return this;
    }

    private createContext(params: any) {
        this.context = {
            id: `recycler-${makeid(8)}`,
            children: [],
            isFocusable: false,
            isScrollable: true,
            isRecyclable: true,
            scrollOffsetX: 0,
            scrollOffsetY: 0,
            type: 'recycler',
            ...params
        };

        this.id = `recycler-${makeid(8)}`;
        this.type = 'recycler';
        this.parent = params.parentClass;
    };

    public updateContext(params: any) {
        this.createContext(params);
    }

    public getContext() {
        return this.context;
    }
};

const RecyclerInstances: { [key: string]: Recycler; } = {};
function createOrReturnInstance(context: any) {
    if (RecyclerInstances[context.id]) {
        return RecyclerInstances[context.id];
    }

    const _Recycler = new Recycler(context);
    RecyclerInstances[_Recycler.context.id] = _Recycler;

    return RecyclerInstances[_Recycler.context.id];
};

function destroyInstance(context: Context) {
    if (RecyclerInstances[context.id]) {
        delete RecyclerInstances[context.id];
    }
}

export type RecyclerCls = Recycler;


export { createOrReturnInstance, destroyInstance };
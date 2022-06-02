import { Context } from '../types';
import { makeid } from '../helpers';
import AbstractFocusModel from './AbstractFocusModel';

class View extends AbstractFocusModel {
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
        if (params.focus) {
            this.context = {
                id: params.parentContext?.id ? `${params.parentContext.id}:view-${makeid(8)}` : `view-${makeid(8)}`,
                parent: params.parentContext,
                children: [],
                isFocusable: true,
                type: 'view',
                ...params
            };

            this.id = params.parentClass?.id ? `${params.parentClass.id}:view-${makeid(8)}` : `view-${makeid(8)}`;
            this.type = 'view';
            this.parent = params.parentClass;
        } else {
            this.id = params.parentClass?.id ? `${params.parentClass.id}:view-${makeid(8)}` : `view-${makeid(8)}`;
            this.type = 'view';
            this.parent = params.parentClass;
            this.context = params.parentContext;
        }
    };

    public updateContext(params: any) {
        this.createContext(params);
    }

    public getContext() {
        return this.context;
    }
};

const ViewInstances: { [key: string]: View; } = {};
function createOrReturnInstance(context: any) {
    if (ViewInstances[context.id]) {
        return ViewInstances[context.id];
    }

    const _View = new View(context);
    ViewInstances[_View.context.id] = _View;

    return ViewInstances[_View.context.id];
};

function destroyInstance(context: Context) {
    if (ViewInstances[context.id]) {
        delete ViewInstances[context.id];
    }
}

export type ViewCls = View;


export { createOrReturnInstance, destroyInstance };
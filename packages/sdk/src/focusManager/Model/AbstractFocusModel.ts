import { Context } from '../types';

export default abstract class AbstractFocusModel {
    abstract id: string;

    abstract context: AbstractFocusModel;
    abstract parentContext: AbstractFocusModel;
    abstract repeatContext: AbstractFocusModel;
    abstract children: AbstractFocusModel[];

    public nodeId?: number | null;
    public node?: any;

    abstract type: string;

    abstract parent?: AbstractFocusModel;

    abstract initialFocus?: AbstractFocusModel;

    abstract getContext(): Context;
    public setInitialFocus(cls: AbstractFocusModel) {

    };
    
    abstract setScreen(cls: AbstractFocusModel): this;
    
    public addChildren(cls: AbstractFocusModel): this {
        this.children.push(cls);

        return this;
    };
};
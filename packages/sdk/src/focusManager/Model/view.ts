import { Context } from '../types';
import { makeid } from '../helpers';
import AbstractFocusModel from './AbstractFocusModel';
import { ScreenCls } from './Screen';

class View extends AbstractFocusModel {
    public id: string;
    public children: AbstractFocusModel[];
    public repeatContext?: {
        parentContext: AbstractFocusModel;
        index: number;
    };
    public parent?: AbstractFocusModel;
    public initialFocus?: AbstractFocusModel;
    public type: string;
    public screen: ScreenCls;
    public isFocused: boolean;

    private _onFocus?: () => void;
    private _onBlur?: () => void;
    private _onPress?: () => void;

    constructor(params: any) {
        super();
        this.children = [];
        this.type = '';
        this.id = '';
        this.isFocused = false;
        // this.screen = {};

        this.createContext(params);
    }

    public destroy(): void {
        destroyInstance(this.id);
    }

    private createContext(params: any) {
        if (params.focus) {
            const id = makeid(8);
            this.id = params.parent?.id ? `${params.parent.id}:view-${id}` : `view-${id}`;
            this.type = 'view';
            this.parent = params.parent;
            this.repeatContext = params.repeatContext;
            this._onFocus = params.onFocus;
            this._onBlur = params.onBlur;
        } else {
            // this.id = params.parentClass?.id ? `${params.parentClass.id}:view-${makeid(8)}` : `view-${makeid(8)}`;
            // this.type = 'view';
            // this.parent = params.parentClass;
            // this.context = params.parentContext;
        }
    }

    public updateContext(params: any) {
        this.createContext(params);
    }

    public isFocusable(): boolean {
        return true;
    }

    public updateEvents({ onPress, onFocus, onBlur }: any) {
        this._onPress = onPress;
        this._onFocus = onFocus;
        this._onBlur = onBlur;

        return this;
    }

    public setScreen(cls: ScreenCls): this {
        this.screen = cls;
        return this;
    }

    public getScreen(): ScreenCls {
        return this.screen;
    }

    public onFocus(): void {
        if (this._onFocus) {
            this._onFocus();
        }
    }

    public onBlur(): void {
        if (this._onBlur) {
            this._onBlur();
        }
    }

    public onPress(): void {
        if (this._onPress) {
            this._onPress();
        }
    }

    public setIsFocused(value: boolean): this {
        this.isFocused = value;

        return this;
    }

    public getIsFocused(): boolean {
        return this.isFocused;
    }
}

const ViewInstances: { [key: string]: View } = {};
function createOrReturnInstance(context: any) {
    if (ViewInstances[context.id]) {
        return ViewInstances[context.id];
    }

    const _View = new View(context);
    ViewInstances[_View.id] = _View;

    return ViewInstances[_View.id];
}

function destroyInstance(id: string) {
    if (ViewInstances[id]) {
        delete ViewInstances[id];
    }
}

export type ViewCls = View;

export { createOrReturnInstance, destroyInstance };

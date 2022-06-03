import { Context } from '../types';
import { ScreenCls } from './screen';

export default abstract class AbstractFocusModel {
    abstract id: string;
    abstract parentContext: AbstractFocusModel;
    abstract repeatContext?: {
        parentContext: AbstractFocusModel;
        index: number;
    };
    abstract children: AbstractFocusModel[];
    abstract type: string;
    abstract parent?: AbstractFocusModel;
    abstract initialFocus?: AbstractFocusModel;

    public layout: any;
    public nodeId?: number | null;
    public node?: any;
    public screen: ScreenCls | undefined;

    abstract getScreen(): ScreenCls | undefined;
    abstract destroy(): void;

    public setLayout(layout: any) {
        this.layout = layout;

        return this;
    }

    public getLayout(): any {
        return this.layout;
    }

    public getLayouts(): any {
        throw new Error('Method is not implemented');
    }

    public isScrollable(): boolean {
        return false;
        // throw new Error('Method is not implemented');
    }

    public getScrollOffsetX(): number {
        return 0;
        // throw new Error('Method is not implemented');
    }

    public getScrollOffsetY(): number {
        return 0;
        // throw new Error('Method is not implemented');
    }

    public setInitialFocus(_cls: AbstractFocusModel): void {
        // to be implement
    }

    abstract setScreen(cls: AbstractFocusModel): this;

    public addChildren(cls: AbstractFocusModel): this {
        this.children.push(cls);

        return this;
    }

    public setIsFocused(_isFocused: boolean): this {
        // NOT implemented

        return this;
    }

    public getIsFocused(): boolean {
        return false;
    }

    public isInBackground(): boolean {
        return false;
    }

    public isInForeground(): boolean {
        return false;
    }

    public isFocusable(): boolean {
        return false;
    }

    public getForbiddenFocusDirections(): string[] {
        return [];
    }

    public onFocus(): void {
        // NO ACTION
    }

    public onBlur(): void {
        // NO ACTION
    }

    public onPress(): void {
        // NO ACTION
    }

    public isHorizontal(): boolean {
        return false;
    }
}

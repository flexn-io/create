import { ScreenCls } from './screen';

export default abstract class AbstractFocusModel {
    protected _layout: any;
    protected _id: string;
    protected _children: AbstractFocusModel[];
    protected _screen: ScreenCls | undefined;

    constructor() {
        this._id = '';
        this._children = [];
    }

    abstract _initialFocus?: AbstractFocusModel;

    public nodeId?: number | null;
    public node?: any;

    abstract destroy(): void;
    abstract getType(): string;
    abstract getParent(): AbstractFocusModel | undefined;

    abstract getRepeatContext():
        | {
              parentContext: AbstractFocusModel;
              index: number;
          }
        | undefined;

    abstract setRepeatContext(rp: AbstractFocusModel): this;

    public getScreen(): ScreenCls | undefined {
        if (this._screen) {
            return this._screen;
        }

        let parentCls = this.getParent();
        while (parentCls && !parentCls.isScreen()) {
            parentCls = parentCls.getParent();
        }

        if (parentCls?.isScreen()) {
            this._screen = parentCls as ScreenCls;
            return this._screen;
        }
    }

    public getId(): string {
        return this._id;
    }

    public setLayout(layout: any): this {
        this._layout = layout;

        return this;
    }

    public updateLayoutProperty(prop: string, value: any): this {
        this._layout[prop] = value;

        return this;
    }

    public getLayout(): any {
        return this._layout;
    }

    public addChildren(cls: AbstractFocusModel): this {
        this._children.push(cls);

        return this;
    }

    public removeChildren(index: number): this {
        this.getChildren().splice(index, 1);

        return this;
    }

    public removeChildrenFromParent(): this {
        if (this.getParent()) {
            this.getParent()
                ?.getChildren()
                .forEach((ch, index) => {
                    if (ch.getId() === this.getId()) {
                        this.getParent()?.getChildren().splice(index, 1);
                    }
                });
        }

        return this;
    }

    public getChildren(): AbstractFocusModel[] {
        return this._children;
    }

    public getLayouts(): any {
        throw new Error('Method is not implemented');
    }

    public isScrollable(): boolean {
        return false;
    }

    public setScrollOffsetX(_value: number): this {
        return this;
    }

    public getScrollOffsetX(): number {
        return 0;
    }

    public getScrollOffsetY(): number {
        return 0;
    }

    public setScrollOffsetY(_value: number): this {
        return this;
    }

    public setInitialFocus(_cls: AbstractFocusModel): void {
        // to be implement
    }

    public setIsFocused(_isFocused: boolean): this {
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

    public isHorizontal(): boolean {
        return false;
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

    public isScreen(): boolean {
        return false;
    }
}

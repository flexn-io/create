import Screen, { STATE_BACKGROUND } from './screen';

const TYPE_SCREEN = 'screen';
// const TYPE_VIEW = 'view';
// const TYPE_RECYCLER = 'recycler';
// const TYPE_SCROLLVIEW = 'scrollview';
export default abstract class AbstractFocusModel {
    protected _layout: any;
    protected _id: string;
    protected _children: AbstractFocusModel[];
    protected _screen: Screen | undefined;

    protected _nextFocusRight: string;
    protected _nextFocusLeft: string;
    protected _nextFocusUp: string;
    protected _nextFocusDown: string;

    constructor(params: any) {
        const { nextFocusRight, nextFocusLeft, nextFocusUp, nextFocusDown } = params;

        this._id = '';
        this._children = [];
        this._nextFocusRight = nextFocusRight;
        this._nextFocusLeft = nextFocusLeft;
        this._nextFocusUp = nextFocusUp;
        this._nextFocusDown = nextFocusDown;
    }

    public nodeId?: number | null;
    public node?: any;

    abstract getType(): string;
    abstract getParent(): AbstractFocusModel | undefined;

    abstract getRepeatContext():
        | {
              parentContext: AbstractFocusModel;
              index: number;
          }
        | undefined;

    abstract setRepeatContext(rp: AbstractFocusModel): this;

    public getScreen(): Screen | undefined {
        if (this._screen) {
            return this._screen;
        }

        let parentCls = this.getParent();
        while (parentCls && !parentCls.isScreen()) {
            parentCls = parentCls.getParent();
        }

        if (parentCls?.isScreen()) {
            this._screen = parentCls as Screen;
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
        } else {
            this.getChildren().forEach((_, index) => {
                this.removeChildren(index);
            });
        }

        return this;
    }

    public getChildren(): AbstractFocusModel[] {
        return this._children;
    }

    public getMostBottomChildren(): AbstractFocusModel {
        return this.getChildren().sort((a: AbstractFocusModel, b: AbstractFocusModel) => {
            if (a.getLayout().yMax > b.getLayout().yMax) {
                return 1;
            }

            return -1;
        })[this.getChildren().length - 1];
    }

    public getNextFocusRight(): string {
        return this._nextFocusRight || '';
    }

    public getNextFocusLeft(): string {
        return this._nextFocusLeft || '';
    }

    public getNextFocusUp(): string {
        return this._nextFocusUp || '';
    }

    public getNextFocusDown(): string {
        return this._nextFocusDown || '';
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

    public setIsFocused(_isFocused: boolean): this {
        return this;
    }

    public getIsFocused(): boolean {
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

    public isRecyclable() {
        return false;
    }

    public isNested() {
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

    public getState(): string {
        if (this.getType() === TYPE_SCREEN) {
            return this.getState();
        }

        return this.getScreen()?.getState() || STATE_BACKGROUND;
    }

    public isInForeground(): boolean {
        if (this.getType() === TYPE_SCREEN) {
            return this.isInForeground();
        }

        return this.getScreen()?.isInForeground() ?? false;
    }

    public isInBackground(): boolean {
        if (this.getType() === TYPE_SCREEN) {
            return this.isInBackground();
        }

        return this.getScreen()?.isInBackground() ?? false;
    }

    public containsForbiddenDirection(direction: string): boolean {
        return this.getForbiddenFocusDirections().includes(direction);
    }

    public setFocus(_cls?: AbstractFocusModel): void {
        // TODO: Implement
    }

    public getOrder(): number {
        return 0;
    }

    public isScreen(): boolean {
        return false;
    }

    public getFocusKey(): string {
        return '';
    }

    public isFirstVisible(): boolean {
        return true;
    }

    public isLastVisible(): boolean {
        return true;
    }
}

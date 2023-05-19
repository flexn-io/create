import { MutableRefObject } from 'react';
import { measureSync, recalculateLayout } from '../layoutManager';
import { ForbiddenFocusDirections, ScreenStates } from '../types';
import Grid from './grid';
import List from './list';
import RecyclerView from './recycler';
import Row from './row';
import Screen from './screen';
import View from './view';

export const TYPE_SCREEN = 'screen';
export const TYPE_VIEW = 'view';
export const TYPE_RECYCLER = 'recycler';
export const TYPE_SCROLL_VIEW = 'scrollview';

export const STATE_BACKGROUND: ScreenStates = 'background';
export default abstract class FocusModel {
    protected _layout: any;
    protected _id: string;
    protected _type: string;
    protected _parent: FocusModel | undefined;
    protected _children: FocusModel[];
    protected _screen: Screen | undefined;
    protected _forbiddenFocusDirections: ForbiddenFocusDirections[];
    protected _isFocusable: boolean;
    protected _isScrollable: boolean;

    protected _nextFocusRight: string | string[];
    protected _nextFocusLeft: string | string[];
    protected _nextFocusUp: string | string[];
    protected _nextFocusDown: string | string[];

    protected _onFocus?: () => void;
    protected _onBlur?: () => void;

    protected _events: { (): void }[];

    constructor(params: any) {
        const { nextFocusRight, nextFocusLeft, nextFocusUp, nextFocusDown } = params;

        this._id = '';
        this._type = '';
        this._children = [];
        this._events = [];
        this.node = { current: undefined };
        this._isFocusable = false;
        this._isScrollable = false;
        this._forbiddenFocusDirections = [];
        this._nextFocusRight = nextFocusRight;
        this._nextFocusLeft = nextFocusLeft;
        this._nextFocusUp = nextFocusUp;
        this._nextFocusDown = nextFocusDown;
    }

    public nodeId?: number | null;
    public node: MutableRefObject<any>;

    public getType(): string {
        return this._type;
    }

    protected unsubscribeEvents() {
        this._events.forEach((event) => event());
    }

    public getParent(): FocusModel | undefined {
        return this._parent;
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

    public addChildren(cls: FocusModel): this {
        this._children.push(cls);

        return this;
    }

    public removeChildren(index: number): this {
        this.getChildren().splice(index, 1);

        return this;
    }

    public isScrollable(): boolean {
        return this._isScrollable;
    }

    public isFocusable(): boolean {
        return this._isFocusable;
    }

    public getScreen(): Screen | undefined {
        if (this._screen) {
            return this._screen;
        }

        let parentCls = this.getParent();
        while (parentCls && parentCls.getType() !== TYPE_SCREEN) {
            parentCls = parentCls.getParent();
        }

        if (parentCls?.getType() === TYPE_SCREEN) {
            this._screen = parentCls as Screen;
            return this._screen;
        }
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
            if (this.getParent()?.getType() === TYPE_RECYCLER) {
                const recycler = this.getParent() as RecyclerView;
                if (recycler.getFocusedView()?.getId() === this.getId()) {
                    recycler.setFocusedView(undefined);
                }
            }
        } else {
            this.getChildren().forEach((_, index) => {
                this.removeChildren(index);
            });
        }

        return this;
    }

    public getChildren(): FocusModel[] {
        return this._children;
    }

    public getFirstFocusableChildren(): View | undefined {
        return this._children.find((ch) => ch.isFocusable()) as View;
    }

    public getMostBottomChildren(): FocusModel {
        return this.getChildren().sort((a: FocusModel, b: FocusModel) => {
            if (a.getLayout()?.yMax > b.getLayout()?.yMax) {
                return 1;
            }

            return -1;
        })[this.getChildren().length - 1];
    }

    public getMostRightChildren(): FocusModel {
        return this.getChildren().sort((a: FocusModel, b: FocusModel) => {
            if (a.getLayout()?.xMax > b.getLayout()?.xMax) {
                return 1;
            }

            return -1;
        })[this.getChildren().length - 1];
    }

    public recalculateChildrenLayouts(ch: FocusModel) {
        ch.getChildren().forEach((a: FocusModel) => {
            this.recalculateChildrenLayouts(a);
        });

        if (ch.isInForeground()) {
            recalculateLayout(ch);
        }
    }

    public remeasureChildrenLayouts(model: FocusModel) {
        if (model.isInForeground()) {
            measureSync({ model, remeasure: true });
        }

        model.getChildren().forEach((a: FocusModel) => {
            this.remeasureChildrenLayouts(a);
        });
    }

    public getNextFocusRight(): string | string[] {
        return this._nextFocusRight || '';
    }

    public getNextFocusLeft(): string | string[] {
        return this._nextFocusLeft || '';
    }

    public getNextFocusUp(): string | string[] {
        return this._nextFocusUp || '';
    }

    public getNextFocusDown(): string | string[] {
        return this._nextFocusDown || '';
    }

    public getForbiddenFocusDirections(): string[] {
        return this._forbiddenFocusDirections;
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

    public getOrder(): number {
        if (this.getType() === TYPE_SCREEN) {
            return this.getOrder();
        }

        return this.getScreen()?.getOrder() || 0;
    }

    public getFocusTaskExecutor(direction: string): Grid | Row | List | undefined {
        if (this.getParent()?.getFocusTaskExecutor(direction)) {
            return this.getParent()?.getFocusTaskExecutor(direction);
        }
    }

    public setNode(ref: MutableRefObject<any>): FocusModel {
        this.node = ref;

        return this;
    }

    public getNode(): { current: MutableRefObject<any> | null } {
        return this.node;
    }
}
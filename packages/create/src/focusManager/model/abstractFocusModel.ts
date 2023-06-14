import { MutableRefObject } from 'react';
import { measureSync, recalculateAbsolutes } from '../layoutManager';
import { ForbiddenFocusDirections, Layout } from '../types';
import Grid from './grid';
import RecyclerView from './recycler';
import Row from './row';
import Screen, { SCREEN_STATES } from './screen';
import View from './view';

export const MODEL_TYPES = {
    SCREEN: 'screen',
    VIEW: 'view',
    RECYCLER: 'recycler',
    SCROLL_VIEW: 'scrollview',
    ROW: 'row',
    GRID: 'grid',
};

interface FocusModelProps {
    nextFocusLeft?: string | string[];
    nextFocusRight?: string | string[];
    nextFocusUp?: string | string[];
    nextFocusDown?: string | string[];
}

export default abstract class FocusModel {
    protected _layout: Layout;
    protected _isLayoutMeasured: boolean;

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

    constructor(params?: FocusModelProps) {
        const { nextFocusRight = '', nextFocusLeft = '', nextFocusUp = '', nextFocusDown = '' } = params || {};

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
        this._isLayoutMeasured = false;

        this._layout = {
            xMin: 0,
            xMax: 0,
            yMin: 0,
            yMax: 0,
            xCenter: 0,
            yCenter: 0,
            width: 0,
            height: 0,
            yOffset: 0,
            xOffset: 0,
            xMaxScroll: 0,
            yMaxScroll: 0,
            scrollContentHeight: 0,
            absolute: {
                xMin: 0,
                xMax: 0,
                yMin: 0,
                yMax: 0,
                xCenter: 0,
                yCenter: 0,
            },
        };
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

    public setLayout(layout: Layout): this {
        this._layout = layout;

        return this;
    }

    public updateLayoutProperty<C extends keyof Layout>(
        prop: C,
        value: C extends 'absolute' ? Layout['absolute'] : number
    ): this {
        this._layout[prop] = value as never;

        return this;
    }

    public getLayout(): Layout {
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
        while (parentCls && parentCls.getType() !== MODEL_TYPES.SCREEN) {
            parentCls = parentCls.getParent();
        }

        if (parentCls?.getType() === MODEL_TYPES.SCREEN) {
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
            if (this.getParent()?.getType() === MODEL_TYPES.RECYCLER) {
                const recycler = this.getParent() as RecyclerView;
                if (recycler.getFocusedView()?.getId() === this.getId()) {
                    recycler.setFocusedView(null);
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

    public recalculateChildrenAbsoluteLayouts(ch: FocusModel) {
        ch.getChildren().forEach((a: FocusModel) => {
            this.recalculateChildrenAbsoluteLayouts(a);
        });

        if (ch.isInForeground()) {
            recalculateAbsolutes(ch);
        }
    }

    public remeasureChildrenLayouts(model: FocusModel) {
        model.getChildren().forEach((a: FocusModel) => {
            this.remeasureChildrenLayouts(a);
        });

        if (model.isInForeground()) {
            measureSync({ model });
        }
    }

    public remeasureSelfAndChildrenLayouts(model: FocusModel) {
        if (model.isInForeground()) {
            measureSync({ model });
        }

        model.getChildren().forEach((a: FocusModel) => {
            this.remeasureSelfAndChildrenLayouts(a);
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
        if (this.getType() === MODEL_TYPES.SCREEN) {
            return this.getState();
        }

        return this.getScreen()?.getState() || SCREEN_STATES.BACKGROUND;
    }

    public isInForeground(): boolean {
        if (this.getType() === MODEL_TYPES.SCREEN) {
            return this.isInForeground();
        }

        return this.getScreen()?.isInForeground() ?? false;
    }

    public isInBackground(): boolean {
        if (this.getType() === MODEL_TYPES.SCREEN) {
            return this.isInBackground();
        }

        return this.getScreen()?.isInBackground() ?? false;
    }

    public containsForbiddenDirection(direction: string): boolean {
        return this.getForbiddenFocusDirections().includes(direction);
    }

    public getOrder(): number {
        if (this.getType() === MODEL_TYPES.SCREEN) {
            return this.getOrder();
        }

        return this.getScreen()?.getOrder() || 0;
    }

    public getFocusTaskExecutor(direction: string): Grid | Row | undefined {
        if (this.getParent()?.getFocusTaskExecutor(direction)) {
            return this.getParent()?.getFocusTaskExecutor(direction);
        }
    }

    public setNode(ref: MutableRefObject<any>): FocusModel {
        this.node = ref;

        return this;
    }

    public getNode(): MutableRefObject<any> {
        return this.node;
    }

    public setIsLayoutMeasured(value: boolean): this {
        this._isLayoutMeasured = value;

        return this;
    }

    public isLayoutMeasured(): boolean {
        return this._isLayoutMeasured;
    }
}

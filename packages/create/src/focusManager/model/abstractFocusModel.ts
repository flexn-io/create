import { MutableRefObject } from 'react';
import { SCREEN_STATES } from '../constants';
import {
    measureAsync,
    measureSync,
    recalculateAbsolutes,
} from '../layoutManager';
import { ForbiddenFocusDirections, Layout, ScreenType } from '../types';
import Grid from './grid';
import Row from './row';
import View from './view';

export const MODEL_TYPES = {
    SCREEN: 'screen',
    VIEW: 'view',
    RECYCLER: 'recycler',
    SCROLL_VIEW: 'scrollview',
    ROW: 'row',
    GRID: 'grid',
    VIEW_GROUP: 'viewGroup',
} as const;

interface FocusModelProps {
    nextFocusLeft?: string | string[];
    nextFocusRight?: string | string[];
    nextFocusUp?: string | string[];
    nextFocusDown?: string | string[];
    verticalViewportOffset?: number;
}

export default abstract class FocusModel {
    protected _layout: Layout;
    protected _isLayoutMeasured: boolean;

    protected _id: string;
    protected _type: (typeof MODEL_TYPES)[keyof typeof MODEL_TYPES] = 'view';
    protected _parent: FocusModel | undefined;
    protected _children: FocusModel[];
    protected _screen: ScreenType | undefined;
    protected _forbiddenFocusDirections: ForbiddenFocusDirections[];
    protected _isFocusable: boolean;
    protected _isScrollable: boolean;
    protected _verticalViewportOffset?: number;

    protected _nextFocusRight: string | string[];
    protected _nextFocusLeft: string | string[];
    protected _nextFocusUp: string | string[];
    protected _nextFocusDown: string | string[];

    protected _onFocus?: () => void;
    protected _onBlur?: () => void;

    protected _events: { (): void }[];

    constructor(params?: FocusModelProps) {
        const {
            nextFocusRight = '',
            nextFocusLeft = '',
            nextFocusUp = '',
            nextFocusDown = '',
            verticalViewportOffset,
        } = params || {};

        this._id = '';
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
        this._verticalViewportOffset = verticalViewportOffset;
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

    public getType(): (typeof MODEL_TYPES)[keyof typeof MODEL_TYPES] {
        return this._type;
    }

    protected unsubscribeEvents() {
        this._events.forEach((event) => event());
    }

    public getParent(): FocusModel | undefined {
        return this._parent;
    }

    public isParentInGroup(group: string) {
        const parentGroup = this.getGroup();

        return parentGroup && parentGroup === group;
    }

    public getGroup(): string | undefined {
        let parent: FocusModel | undefined | null = this.getParent();
        let group;

        while (parent) {
            if (
                parent.getType() === 'viewGroup' &&
                !parent.isFocusAllowedOutsideGroup()
            ) {
                group = parent.getGroup();
                parent = null;
            } else {
                parent = parent?.getParent();
            }
        }

        return group || this.getScreen()?.getGroup();
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

    public getScreen(): ScreenType | undefined {
        if (this._screen) {
            return this._screen;
        }

        let parentCls = this.getParent();
        while (parentCls && parentCls.getType() !== MODEL_TYPES.SCREEN) {
            parentCls = parentCls.getParent();
        }

        if (parentCls?.getType() === MODEL_TYPES.SCREEN) {
            this._screen = parentCls as ScreenType;
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
                const recycler = this.getParent();
                if (recycler!.getFocusedView()?.getId() === this.getId()) {
                    recycler!.setFocusedView(null);
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

    public getInitialFocusableChildren(index: number): View | undefined {
        return this._children.find(
            (ch, i) => ch.isFocusable() && index === i
        ) as View;
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
        if (ch.isInForeground()) {
            recalculateAbsolutes(ch);
        }

        ch.getChildren().forEach((a: FocusModel) => {
            this.recalculateChildrenAbsoluteLayouts(a);
        });
    }

    public async remeasureChildrenLayouts(model: FocusModel) {
        if (model.isInForeground()) {
            await measureAsync({ model });

            if (model.getType() === MODEL_TYPES.VIEW) {
                model
                    .getScreen()
                    ?.removeComponentFromPendingLayoutMap(model.getId());
            }
        }

        model.getChildren().forEach((a: FocusModel) => {
            this.remeasureChildrenLayouts(a);
        });
    }

    public remeasureSelfAndChildrenLayouts(model: FocusModel) {
        if (model.isInForeground()) {
            measureSync({
                model,
                callback: () => {
                    if (model.getType() === MODEL_TYPES.VIEW) {
                        model
                            .getScreen()
                            ?.removeComponentFromPendingLayoutMap(
                                model.getId()
                            );
                    }
                },
            });
        }

        model.getChildren().forEach((a: FocusModel) => {
            this.remeasureSelfAndChildrenLayouts(a);
        });
    }

    public getNextFocusRight(): string | string[] {
        return this._nextFocusRight || '';
    }

    public setNextFocusRight(focusKey: string | string[]) {
        this._nextFocusRight = focusKey;

        return this;
    }

    public getNextFocusLeft(): string | string[] {
        return this._nextFocusLeft || '';
    }

    public setNextFocusLeft(focusKey: string | string[]) {
        this._nextFocusLeft = focusKey;

        return this;
    }

    public getNextFocusUp(): string | string[] {
        return this._nextFocusUp || '';
    }

    public setNextFocusUp(focusKey: string | string[]) {
        this._nextFocusUp = focusKey;

        return this;
    }

    public getNextFocusDown(): string | string[] {
        return this._nextFocusDown || '';
    }

    public setNextFocusDown(focusKey: string | string[]) {
        this._nextFocusDown = focusKey;

        return this;
    }

    public getForbiddenFocusDirections(): string[] {
        return this._forbiddenFocusDirections;
    }

    public onFocus(): void {
        if (this._onFocus && this.getNode().current) {
            this._onFocus();
        }
    }

    public onBlur(): void {
        if (this._onBlur && this.getNode().current) {
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

    public getParents(group?: string): FocusModel[] {
        let parent = this.getParent();
        if (group && !this?.getParent()?.isParentInGroup(group)) {
            parent = undefined;
        }

        const parents = parent ? [parent] : [];
        while (parent) {
            parent = parent?.getParent();
            if (group && parent && parent.isParentInGroup(group)) {
                parents.push(parent);
            } else if (parent && !group) {
                parents.push(parent);
            }
        }

        return parents;
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

    public getRepeatContext():
        | {
              focusContext: FocusModel;
              index: number;
          }
        | undefined {
        throw new Error('Not implemented');
    }

    public getVerticalViewportOffset(): number | undefined {
        return this._verticalViewportOffset;
    }

    public horizontalContentContainerGap(): number {
        throw new Error('Not implemented');
    }

    public verticalContentContainerGap(): number {
        throw new Error('Not implemented');
    }

    public getScrollOffsetX(): number {
        throw new Error('Not implemented');
    }

    public getLastFocused(): View | null {
        throw new Error('Not implemented');
    }

    public getScrollOffsetY(): number {
        throw new Error('Not implemented');
    }

    public getAutoLayoutSize(): number {
        throw new Error('Not implemented');
    }

    public isFocusAllowedOutsideGroup(): boolean {
        throw new Error('Not implemented');
    }

    public getLayouts(): {
        x: number;
        y: number;
        width: number;
        height: number;
    }[] {
        throw new Error('Not implemented');
    }

    public isHorizontal(): boolean {
        throw new Error('Not implemented');
    }

    public getListHeaderDimensions(): { width: number; height: number } {
        throw new Error('Not implemented');
    }

    public isScrolling(): boolean {
        throw new Error('Not implemented');
    }

    public getFocusedView(): View | null {
        throw new Error('Not implemented');
    }

    public setFocusedView(_view: View | null)  {
        throw new Error('Not implemented');
    }
}

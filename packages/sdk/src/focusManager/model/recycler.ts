import AbstractFocusModel from './AbstractFocusModel';
import { ForbiddenFocusDirections } from '../types';
import { alterForbiddenFocusDirections, makeid } from '../helpers';
import View from './view';
class Recycler extends AbstractFocusModel {
    protected _type: string;
    private _parent?: AbstractFocusModel;
    private _layouts: any;
    private _scrollOffsetX: number;
    private _scrollOffsetY: number;
    private _isNested: boolean;
    private _isHorizontal: boolean;
    private _forbiddenFocusDirections: ForbiddenFocusDirections[];
    private _focusedIndex: number;
    private _initialRenderIndex: number;
    private _focusedView?: View;
    private _repeatContext:
        | {
              parentContext: AbstractFocusModel;
              index: number;
          }
        | undefined;

    private _onFocus?: () => void;
    private _onBlur?: () => void;

    constructor(params: any) {
        super(params);

        const {
            isHorizontal,
            isNested,
            parent,
            repeatContext,
            forbiddenFocusDirections,
            onFocus,
            onBlur,
            initialRenderIndex = 0,
        } = params;

        this._id = `recycler-${makeid(8)}`;
        this._type = 'recycler';
        this._layouts = [];
        this._scrollOffsetX = 0;
        this._scrollOffsetY = 0;
        this._isNested = isNested;
        this._isHorizontal = isHorizontal;
        this._parent = parent;
        this._repeatContext = repeatContext;
        this._forbiddenFocusDirections = alterForbiddenFocusDirections(forbiddenFocusDirections);
        this._focusedIndex = 0;
        this._initialRenderIndex = initialRenderIndex;

        this._onFocus = onFocus;
        this._onBlur = onBlur;
    }

    public getType(): string {
        return this._type;
    }

    public isFocusable(): boolean {
        return false;
    }

    public getLayouts(): [] {
        return this._layouts;
    }

    public setLayouts(layouts: any) {
        this._layouts = layouts;

        return this;
    }

    public isScrollable(): boolean {
        return true;
    }

    public isRecyclable(): boolean {
        return true;
    }

    public isNested(): boolean {
        return this._isNested;
    }

    public isHorizontal(): boolean {
        return this._isHorizontal;
    }

    public setScrollOffsetX(value: number): this {
        this._scrollOffsetX = value;

        return this;
    }

    public getScrollOffsetX(): number {
        return this._scrollOffsetX;
    }

    public setScrollOffsetY(value: number): this {
        this._scrollOffsetY = value;

        return this;
    }

    public getScrollOffsetY(): number {
        return this._scrollOffsetY;
    }

    public getParent(): AbstractFocusModel | undefined {
        return this._parent;
    }

    public setRepeatContext(value: any): this {
        this._repeatContext = value;

        return this;
    }

    public getRepeatContext(): { parentContext: AbstractFocusModel; index: number } | undefined {
        return this._repeatContext;
    }

    public getForbiddenFocusDirections(): ForbiddenFocusDirections[] {
        return this._forbiddenFocusDirections;
    }

    public setFocusedIndex(index: number): this {
        this._focusedIndex = index;

        return this;
    }

    public getFocusedIndex(): number {
        return this._focusedIndex;
    }

    public setFocusedView(view?: View): this {
        this._focusedView = view;

        return this;
    }

    public getInitialRenderIndex(): number {
        return this._initialRenderIndex;
    }

    public getFocusedView(): View | undefined {
        return this._focusedView;
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
}

export default Recycler;

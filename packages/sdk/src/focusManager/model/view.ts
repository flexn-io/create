import CoreManager from '../service/core';
import { makeid } from '../helpers';
import AbstractFocusModel, { TYPE_RECYCLER } from './AbstractFocusModel';
import { alterForbiddenFocusDirections } from '../helpers';
import Recycler from './recycler';

class View extends AbstractFocusModel {
    private _isFocused: boolean;
    private _focusKey: string;
    private _hasPreferredFocus: boolean;
    private _repeatContext:
        | {
              parentContext: AbstractFocusModel;
              index: number;
          }
        | undefined;

    private _onPress?: () => void;

    constructor(params: any) {
        super(params);

        const {
            repeatContext,
            parent,
            forbiddenFocusDirections,
            onFocus,
            onBlur,
            onPress,
            focusKey,
            hasPreferredFocus,
        } = params;

        const id = makeid(8);
        this._id = parent?.getId() ? `${parent.getId()}:view-${id}` : `view-${id}`;
        this._type = 'view';
        this._parent = parent;
        this._isFocused = false;
        this._isFocusable = true;
        this._repeatContext = repeatContext;
        this._focusKey = focusKey;
        this._forbiddenFocusDirections = alterForbiddenFocusDirections(forbiddenFocusDirections);
        this._hasPreferredFocus = hasPreferredFocus;

        this._onFocus = onFocus;
        this._onBlur = onBlur;
        this._onPress = onPress;

        this.init();
    }

    private init() {
        if (this.getParent()?.getType() === TYPE_RECYCLER) {
            const parent = this.getParent() as Recycler;
            if (parent.getInitialRenderIndex() && parent.getInitialRenderIndex() === this.getRepeatContext()?.index) {
                parent.setFocusedView(this);
            } else if (!parent.getFocusedView() && this.getRepeatContext()?.index === 0) {
                parent.setFocusedView(this);
            }
        }
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

    public setFocus() {
        CoreManager.executeFocus(this);
        CoreManager.executeUpdateGuideLines();
    }

    public onPress(): void {
        if (this._onPress) {
            this._onPress();
        }
    }

    public setIsFocused(value: boolean): this {
        this._isFocused = value;

        if (value && this.getParent()?.getType() === TYPE_RECYCLER) {
            const currentIndex = this.getRepeatContext()?.index;
            if (currentIndex !== undefined) {
                (this.getParent() as Recycler).setFocusedIndex(currentIndex).setFocusedView(this);
            }
        }

        return this;
    }

    public getIsFocused(): boolean {
        return this._isFocused;
    }

    public setRepeatContext(value: any): this {
        this._repeatContext = value;

        return this;
    }

    public getRepeatContext(): { parentContext: AbstractFocusModel; index: number } | undefined {
        return this._repeatContext;
    }

    public getFocusKey(): string {
        return this._focusKey;
    }

    public hasPreferredFocus(): boolean {
        return this._hasPreferredFocus;
    }
}

export default View;

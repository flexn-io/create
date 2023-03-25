import Recycler from './recycler';
import Row from './row';
import Core from '../service/core';
import AbstractFocusModel, { TYPE_RECYCLER } from './AbstractFocusModel';
import View from './view';

class List extends Recycler {
    constructor(params: any) {
        super(params);

        this._type = 'list';
    }

    public getType(): string {
        return this._type;
    }

    public getRows(): Row[] {
        return this._children as Row[];
    }

    private getCurrentFocusIndex(): number {
        if (Core.getCurrentFocus()?.getParent()?.getType() === TYPE_RECYCLER) {
            return (Core.getCurrentFocus()?.getParent() as Recycler).getRepeatContext()?.index || 0;
        }

        return 0;
    }

    public getNextFocusable(direction: string): View | undefined | null {
        if (this._isInBounds(direction)) {
            const candidates = Object.values(Core.getViews()).filter(
                (c) =>
                    c.isInForeground() &&
                    c.getParent()?.getParent()?.getId() === Core.getCurrentFocus()?.getParent()?.getParent()?.getId() &&
                    c.getOrder() === Core.getCurrentMaxOrder()
            );

            return Core.getNextFocusableContext(direction, candidates, false);
        } else if (!this._isInBounds(direction)) {
            return Core.getNextFocusableContext(direction);
        }
    }

    private _isInBounds(direction: string): boolean {
        const current = this.getCurrentFocusIndex();

        if (direction === 'up' && current === 0) {
            return false;
        }

        if (direction === 'down' && current === this.getLayouts().length - 1) {
            return false;
        }

        return true;
    }

    public scrollToInitialRenderIndex(): void {
        //TODO: implement
    }

    public getFocusTaskExecutor(_direction: string): AbstractFocusModel {
        return this;
    }
}

export default List;

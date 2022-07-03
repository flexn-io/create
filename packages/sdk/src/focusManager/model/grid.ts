import Recycler from './recycler';
import Core from './core';
import AbstractFocusModel from './AbstractFocusModel';

class Grid extends Recycler {
    private _itemsInRow: number;

    constructor(params: any) {
        super(params);

        this._type = 'grid';
        this._itemsInRow = 0;
    }

    public getType(): string {
        return this._type;
    }

    private getCurrentFocusIndex(): number {
        return Core.getCurrentFocus()?.getRepeatContext()?.index || 0;
    }

    private getCurrentRow() {
        return Math.ceil((this.getCurrentFocusIndex() + 1) / this._itemsInRow) || 1;
    }

    private getMaxRows() {
        return Math.ceil(this.getLayouts().length / this._itemsInRow);
    }

    public getNextFocusable(direction: string): AbstractFocusModel | undefined | null {
        this.getItemsInRow();

        if (this._isInBounds(direction)) {
            const candidates = Object.values(Core.getFocusMap()).filter(
                (c) =>
                    c.isInForeground() &&
                    c.isFocusable() &&
                    c.getParent()?.getId() === Core.getCurrentFocus()?.getParent()?.getId()
            );
            const next = Core.getNextFocusableContext(direction, true, candidates);

            if (
                direction === 'down' &&
                next?.getId() === Core.getCurrentFocus()?.getId() &&
                this.getCurrentRow() === this.getMaxRows() - 1
            ) {
                const max = Math.max(...candidates.map((o) => o.getRepeatContext()?.index || 0));
                const maxCandidate = candidates.find((o) => o.getRepeatContext()?.index === max);
                if (maxCandidate) {
                    Core.executeFocus(maxCandidate);
                    Core.executeScroll(direction);
                    Core.executeUpdateGuideLines();
                    return;
                }
            }

            return next;
        } else if (!this._isInBounds(direction)) {
            const nextFocus = Core.getNextFocusableContext(direction, true);

            if (nextFocus) {
                Core.executeFocus(nextFocus);
                Core.executeScroll(direction);
                Core.executeUpdateGuideLines();
            }
        }
    }

    private _isInBounds(direction: string): boolean {
        const row = Math.ceil((this.getCurrentFocusIndex() + 1) / this._itemsInRow) || 1;
        const maxRows = Math.ceil(this.getLayouts().length / this._itemsInRow);

        if (row === 1 && direction === 'up') {
            return false;
        }

        if (row === maxRows && direction === 'down') {
            return false;
        }

        return true;
    }

    public getItemsInRow(): number {
        if (this._itemsInRow) {
            return this._itemsInRow;
        }

        const groups: any = [];
        this.getLayouts().forEach((layout: any) => {
            groups[layout.x] = layout;
        });

        this._itemsInRow = Object.keys(groups).length;

        return this._itemsInRow;
    }
}

export default Grid;

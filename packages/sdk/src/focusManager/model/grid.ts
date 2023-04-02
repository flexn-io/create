import Recycler from './recycler';
import Core from '../service/core';
import Scroller from '../service/scroller';
import View from './view';
import Event, { EVENT_TYPES } from '../events';
import { CoreManager } from '../..';
import { measureAsync } from '../layoutManager';

class Grid extends Recycler {
    private _itemsInRow: number;

    constructor(params: any) {
        super(params);

        this._type = 'grid';
        this._itemsInRow = 0;

        this._onMountAndMeasured = this._onMountAndMeasured.bind(this);
        this._onUnmount = this._onUnmount.bind(this);
        this._onLayout = this._onLayout.bind(this);

        this._events = [
            Event.subscribe(this, EVENT_TYPES.ON_MOUNT_AND_MEASURED, this._onMountAndMeasured),
            Event.subscribe(this, EVENT_TYPES.ON_UNMOUNT, this._onUnmount),
            Event.subscribe(this, EVENT_TYPES.ON_LAYOUT, this._onLayout),
        ];
    }

    // EVENTS
    protected _onMountAndMeasured() {
        CoreManager.registerFocusAwareComponent(this);
    }

    protected _onUnmount() {
        CoreManager.removeFocusAwareComponent(this);
    }

    protected async _onLayout() {
        await measureAsync({ model: this });
    }

    // END EVENTS

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

    public getNextFocusable(direction: string): View | undefined | null {
        this.getItemsInRow();

        if (this._isInBounds(direction)) {
            const candidates = Object.values(Core.getViews()).filter(
                (c) =>
                    c.isInForeground() &&
                    c.getParent()?.getId() === Core.getCurrentFocus()?.getParent()?.getId() &&
                    c.getOrder() === Core.getCurrentMaxOrder()
            );

            const next = Core.getNextFocusableContext(direction, candidates, false);

            if (
                direction === 'down' &&
                next?.getId() === Core.getCurrentFocus()?.getId() &&
                this.getCurrentRow() === this.getMaxRows() - 1
            ) {
                const max = Math.max(...candidates.map((o) => o.getRepeatContext()?.index || 0));
                return candidates.find((o) => o.getRepeatContext()?.index === max);
            }

            return next;
        } else if (!this._isInBounds(direction)) {
            return Core.getNextFocusableContext(direction);
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

        if (['left', 'right'].includes(direction)) {
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

    public scrollToInitialRenderIndex(): void {
        const layout: any = this.getLayouts()[this.getInitialRenderIndex()] ?? { x: 0, y: 0 };
        const verticalOffset = this.getScreen()?.getVerticalViewportOffset() ?? 0;
        const target = { x: 0, y: layout.y - verticalOffset };
        setTimeout(() => {
            Scroller.scrollRecycler(target, this);
        }, 0);
    }

    public getFocusTaskExecutor(_direction: string): Grid {
        return this;
    }
}

export default Grid;

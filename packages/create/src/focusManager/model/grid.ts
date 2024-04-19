import Recycler from './recycler';
import Core from '../service/core';
import View from './view';
import Event, { EVENT_TYPES } from '../events';
import { CoreManager } from '../..';
import { measureAsync } from '../layoutManager';
import { FlashListProps, FocusDirection } from '../types';
import { DIRECTIONS } from '../constants';
class Grid extends Recycler {
    private _itemsInRow: number;

    constructor(
        params: Omit<
            FlashListProps<any> & FlashListProps<any>['focusOptions'],
            | 'style'
            | 'scrollViewProps'
            | 'renderItem'
            | 'type'
            | 'data'
            | 'focusOptions'
            | 'nextFocusDown'
            | 'nextFocusLeft'
            | 'nextFocusUp'
            | 'nextFocusRight'
        >
    ) {
        super(params);

        this._type = 'grid';
        this._itemsInRow = 0;

        this._onMountAndMeasured = this._onMountAndMeasured.bind(this);
        this._onUnmount = this._onUnmount.bind(this);
        this._onLayout = this._onLayout.bind(this);

        this._events = [
            Event.subscribe(this.getType(), this.getId(), EVENT_TYPES.ON_MOUNT_AND_MEASURED, this._onMountAndMeasured),
            Event.subscribe(this.getType(), this.getId(), EVENT_TYPES.ON_UNMOUNT, this._onUnmount),
            Event.subscribe(this.getType(), this.getId(), EVENT_TYPES.ON_LAYOUT, this._onLayout),
        ];
    }

    // EVENTS
    protected _onMountAndMeasured() {
        CoreManager.registerFocusAwareComponent(this);
    }

    protected _onUnmount() {
        CoreManager.removeFocusAwareComponent(this);
        this.unsubscribeEvents();
    }

    protected async _onLayout() {
        await measureAsync({ model: this });
        this.remeasureChildrenLayouts(this);
        Event.emit(this.getType(), this.getId(), EVENT_TYPES.ON_LAYOUT_MEASURE_COMPLETED);
    }

    // END EVENTS

    private getCurrentFocusIndex(): number {
        return Core.getCurrentFocus()?.getRepeatContext()?.index || 0;
    }

    private getCurrentRow() {
        return Math.ceil((this.getCurrentFocusIndex() + 1) / this._itemsInRow) || 1;
    }

    private getMaxRows() {
        return Math.ceil(this.getLayouts().length / this._itemsInRow);
    }

    public getNextFocusable(direction: FocusDirection): {
        view: View | null;
        forcedFocusKey?: string;
    } {
        this.getItemsInRow();

        if (this._isInBounds(direction)) {
            const candidates = Object.values(Core.getViews()).filter(
                (c) =>
                    c.isInForeground() &&
                    c.getParent()?.getId() === Core.getCurrentFocus()?.getParent()?.getId() &&
                    c.getOrder() === Core.getCurrentMaxOrder()
            );

            const { view: next } = Core.getNextFocusableContext(direction, candidates);

            // Prevent focus loose on fast scrolling
            if (
                Core.getCurrentFocus()?.getRepeatContext()?.index !== undefined &&
                next?.getRepeatContext()?.index !== undefined &&
                Core.getCurrentFocus()?.getParent()?.getId() === next.getParent()?.getId()
            ) {
                const diff = Math.abs(
                    Core.getCurrentFocus()?.getRepeatContext()!.index as number - next?.getRepeatContext()!.index
                );

                if (diff > this._itemsInRow) {
                    return { view: Core.getCurrentFocus() };
                }
            }

            if (
                direction === DIRECTIONS.DOWN &&
                next?.getId() === Core.getCurrentFocus()?.getId() &&
                this.getCurrentRow() === this.getMaxRows() - 1
            ) {
                const max = Math.max(...candidates.map((o) => o.getRepeatContext()?.index || 0));
                return {
                    view: candidates.find((o) => o.getRepeatContext()?.index === max) ?? null,
                };
            }

            return { view: next };
        } else if (!this._isInBounds(direction)) {
            if (
                direction === DIRECTIONS.RIGHT &&
                this.getCurrentFocusIndex() + 1 === this.getLayouts().length &&
                this.getLayouts().length % this._itemsInRow !== 0
            ) {
                return { view: null };
            }

            return Core.getNextFocusableContext(direction);
        }

        return { view: null };
    }

    private _isInBounds(direction: FocusDirection): boolean {
        const row = Math.ceil((this.getCurrentFocusIndex() + 1) / this._itemsInRow) || 1;
        const maxRows = Math.ceil(this.getLayouts().length / this._itemsInRow);

        if (row === 1 && direction === DIRECTIONS.UP) {
            return false;
        }

        if (row === maxRows && direction === DIRECTIONS.DOWN) {
            return false;
        }

        if (direction === DIRECTIONS.LEFT || direction === DIRECTIONS.RIGHT) {
            return false;
        }

        return true;
    }

    public getItemsInRow(): number {
        if (this._itemsInRow) {
            return this._itemsInRow;
        }

        const groups: Record<number, { x: number; y: number }> = [];
        this.getLayouts().forEach((layout) => {
            groups[layout.x] = layout;
        });

        this._itemsInRow = Object.keys(groups).length;

        return this._itemsInRow;
    }

    public scrollToInitialRenderIndex(): void {
        // empty
    }

    public getFocusTaskExecutor(_direction: string): Grid {
        return this;
    }
}

export default Grid;

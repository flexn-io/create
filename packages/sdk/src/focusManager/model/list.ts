import Recycler from './recycler';
import Row from './row';
import Core from '../service/core';
import { TYPE_RECYCLER } from './FocusModel';
import View from './view';
import Event, { EVENT_TYPES } from '../events';
import { CoreManager } from '../..';
import { measureAsync } from '../layoutManager';

class List extends Recycler {
    constructor(params: any) {
        super(params);

        this._type = 'list';
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
        this.unsubscribeEvents();
    }

    protected async _onLayout() {
        await measureAsync({ model: this });
        Event.emit(this, EVENT_TYPES.ON_LAYOUT_MEASURE_COMPLETED);
    }

    // END EVENTS
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

    public getFocusTaskExecutor(_direction: string): List {
        return this;
    }
}

export default List;

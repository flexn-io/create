import Recycler from './recycler';
import Core from '../service/core';
import { MODEL_TYPES } from './abstractFocusModel';
import Event, { EVENT_TYPES } from '../events';
import { CoreManager } from '../..';
import { measureAsync } from '../layoutManager';
import RecyclerView from './recycler';
import { FlashListProps, FocusDirection, ViewType } from '../types';
import { DIRECTIONS } from '../constants';

class Row extends Recycler {
    constructor(
        params: Omit<
            FlashListProps<any> & FlashListProps<any>['focusOptions'],
            'style' | 'scrollViewProps' | 'renderItem' | 'type' | 'data' | 'focusOptions'
        >
    ) {
        super(params);

        this._type = 'row';

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
        this.remeasureChildrenLayouts(this);
        Event.emit(this, EVENT_TYPES.ON_LAYOUT_MEASURE_COMPLETED);
    }

    // END EVENTS

    public getType(): string {
        return this._type;
    }

    public getLastFocused(): ViewType | null {
        return this?.getFocusedView() ?? this.getFirstFocusableChildren() ?? null;
    }

    private getCurrentFocusIndex(): number {
        return Core.getCurrentFocus()?.getRepeatContext()?.index || 0;
    }

    public getNextFocusable(direction: FocusDirection): ViewType | null {
        const isHorizontal = DIRECTIONS.LEFT === direction || DIRECTIONS.RIGHT === direction;
        const isVertical = DIRECTIONS.UP === direction || DIRECTIONS.DOWN === direction;
        if (this._isInBounds(direction) && isHorizontal) {
            const candidates = Object.values(Core.getViews()).filter(
                (c) =>
                    c.isInForeground() &&
                    c.getParent()?.getId() === Core.getCurrentFocus()?.getParent()?.getId() &&
                    c.getOrder() === Core.getCurrentMaxOrder()
            );

            return Core.getNextFocusableContext(direction, candidates, false);
        } else if (!this._isInBounds(direction) || isVertical) {
            const nextFocus = Core.getNextFocusableContext(direction);

            if (
                isHorizontal &&
                nextFocus?.getParent() instanceof RecyclerView &&
                (nextFocus?.getParent() as RecyclerView)?.isHorizontal()
            ) {
                return Core.getCurrentFocus();
            }

            return nextFocus;
        }

        return null;
    }

    private _isInBounds(direction: string): boolean {
        const current = this.getCurrentFocusIndex();

        if (!this.isHorizontal() && (DIRECTIONS.LEFT === direction || DIRECTIONS.RIGHT === direction)) {
            return false;
        }

        if (DIRECTIONS.LEFT === direction && current === 0) {
            return false;
        }

        if (DIRECTIONS.RIGHT === direction && current === this.getLayouts().length - 1) {
            return false;
        }

        return true;
    }

    public scrollToInitialRenderIndex(): void {
        const interval = setInterval(() => {
            const currentChildren = this.getChildren().find(
                (ch) =>
                    ch.getType() === MODEL_TYPES.VIEW &&
                    (ch as ViewType).getRepeatContext()?.index === this.getInitialRenderIndex()
            );
            if (currentChildren) {
                this.setFocusedView(currentChildren as ViewType);
                clearInterval(interval);
            }
        }, 100);
    }

    public getFocusTaskExecutor(_direction: string): Row | undefined {
        return this;
    }
}

export default Row;

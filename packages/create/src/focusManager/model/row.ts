import Recycler from './recycler';
import View from './view';
import Core from '../service/core';
import Scroller from '../service/scroller';
import { DIRECTION_VERTICAL } from '../constants';
import Event, { EVENT_TYPES } from '../events';
import { CoreManager } from '../..';
import { measureAsync } from '../layoutManager';
import RecyclerView from './recycler';

class Row extends Recycler {
    constructor(params: any) {
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
        Event.emit(this, EVENT_TYPES.ON_LAYOUT_MEASURE_COMPLETED);
    }

    // END EVENTS

    public getType(): string {
        return this._type;
    }

    public getLastFocused(): View | undefined {
        return this?.getFocusedView() ?? this.getFirstFocusableChildren();
    }

    private getCurrentFocusIndex(): number {
        return Core.getCurrentFocus()?.getRepeatContext()?.index || 0;
    }

    public getNextFocusable(direction: string): View | undefined | null {
        if (this._isInBounds(direction) && ['right', 'left'].includes(direction)) {
            const candidates = Object.values(Core.getViews()).filter(
                (c) =>
                    c.isInForeground() &&
                    c.getParent()?.getId() === Core.getCurrentFocus()?.getParent()?.getId() &&
                    c.getOrder() === Core.getCurrentMaxOrder()
            );

            return Core.getNextFocusableContext(direction, candidates, false);
        } else if (!this._isInBounds(direction) || ['up', 'down'].includes(direction)) {
            const nextFocus = Core.getNextFocusableContext(direction);

            if (
                ['right', 'left'].includes(direction) &&
                nextFocus?.getParent() instanceof RecyclerView &&
                (nextFocus?.getParent() as RecyclerView)?.isHorizontal()
            ) {
                return Core.getCurrentFocus();
            }

            return nextFocus;
        }
    }

    private _isInBounds(direction: string): boolean {
        const current = this.getCurrentFocusIndex();

        if (!this.isHorizontal() && ['right', 'left'].includes(direction)) {
            return false;
        }

        if (direction === 'left' && current === 0) {
            return false;
        }

        if (direction === 'right' && current === this.getLayouts().length - 1) {
            return false;
        }

        return true;
    }

    public scrollToInitialRenderIndex(): void {
        const layout: any = this.getLayouts()[this.getInitialRenderIndex()] ?? { x: 0, y: 0 };
        const horizontalOffset = this.getScreen()?.getHorizontalViewportOffset() ?? 0;
        const verticalOffset = this.getScreen()?.getVerticalViewportOffset() ?? 0;
        const target = this.isHorizontal()
            ? { x: layout.x - horizontalOffset, y: 0 }
            : { y: layout.y - verticalOffset, x: 0 };

        setTimeout(() => {
            Scroller.scrollRecycler(target, this);
        }, 0);

        const interval = setInterval(() => {
            const currentChildren = this.getChildren().find(
                (ch) => ch instanceof View && ch.getRepeatContext()?.index === this.getInitialRenderIndex()
            );
            if (currentChildren) {
                this.setFocusedView(currentChildren as View);
                clearInterval(interval);
            }
        }, 100);
    }

    public getFocusTaskExecutor(direction: string): Row | undefined {
        if (this.isNested() && DIRECTION_VERTICAL.includes(direction)) {
            return this.getParent() as Row;
        }

        return this;
    }
}

export default Row;
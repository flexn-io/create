import Recycler from './recycler';
import Core from '../service/core';
import { MODEL_TYPES } from './abstractFocusModel';
import Event, { EVENT_TYPES } from '../events';
import CoreManager from '../service/core';
import { measureAsync } from '../layoutManager';
import RecyclerView from './recycler';
import { FlashListProps, FocusDirection, ViewType } from '../types';
import { DIRECTIONS } from '../constants';

class Row extends Recycler {
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

        this._type = 'row';

        this._onMountAndMeasured = this._onMountAndMeasured.bind(this);
        this._onUnmount = this._onUnmount.bind(this);
        this._onLayout = this._onLayout.bind(this);

        this._events = [
            Event.subscribe(
                this.getType(),
                this.getId(),
                EVENT_TYPES.ON_MOUNT_AND_MEASURED,
                this._onMountAndMeasured
            ),
            Event.subscribe(
                this.getType(),
                this.getId(),
                EVENT_TYPES.ON_UNMOUNT,
                this._onUnmount
            ),
            Event.subscribe(
                this.getType(),
                this.getId(),
                EVENT_TYPES.ON_LAYOUT,
                this._onLayout
            ),
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
        Event.emit(
            this.getType(),
            this.getId(),
            EVENT_TYPES.ON_LAYOUT_MEASURE_COMPLETED
        );
    }

    // END EVENTS

    public getLastFocused(): ViewType | null {
        return (
            this?.getFocusedView() ??
            this.getInitialFocusableChildren(this.getInitialFocusIndex()) ??
            null
        );
    }

    private getCurrentFocusIndex(): number {
        return Core.getCurrentFocus()?.getRepeatContext()?.index || 0;
    }

    public getNextFocusable(direction: FocusDirection): {
        view: ViewType | null;
        forcedFocusKey?: string;
    } {
        const isHorizontal =
            DIRECTIONS.LEFT === direction || DIRECTIONS.RIGHT === direction;
        const isVertical =
            DIRECTIONS.UP === direction || DIRECTIONS.DOWN === direction;
        if (this._isInBounds(direction) && isHorizontal) {
            const candidates = Object.values(Core.getViews()).filter(
                (c) =>
                    c.isInForeground() &&
                    c.getParent()?.getId() ===
                        Core.getCurrentFocus()?.getParent()?.getId() &&
                    c.getOrder() === Core.getCurrentMaxOrder()
            );

            const { view: next } = Core.getNextFocusableContext(
                direction,
                candidates
            );

            // Prevent focus loose on fast scrolling
            if (
                Core.getCurrentFocus()?.getRepeatContext()?.index !==
                    undefined &&
                next?.getRepeatContext()?.index !== undefined
            ) {
                const diff = Math.abs(
                    (Core.getCurrentFocus()?.getRepeatContext()?.index as number) -
                        (next?.getRepeatContext()?.index as number)
                );

                if (diff > 1) {
                    return { view: Core.getCurrentFocus() };
                }
            }

            return { view: next };
        } else if (!this._isInBounds(direction) || isVertical) {
            // const currentIndex = this.getCurrentFocusIndex();

            const { view: next } = Core.getNextFocusableContext(direction);

            if (isVertical) {
                if (
                    Core.getCurrentFocus()?.getRepeatContext()?.index !==
                        undefined &&
                    next?.getRepeatContext()?.index !== undefined &&
                    Core.getCurrentFocus()?.getParent()?.getId() ===
                        next.getParent()?.getId()
                ) {
                    const diff = Math.abs(
                        (Core.getCurrentFocus()?.getRepeatContext()?.index as number) -
                            (next?.getRepeatContext()?.index as number)
                    );

                    if (diff > 1) {
                        return { view: Core.getCurrentFocus() };
                    }
                }
                // if (
                //     currentIndex > 1 &&
                //     next?.getRepeatContext()?.index === undefined
                // ) {
                //     // console.log('WHATS GOING ON', Core.getCurrentFocus());
                //     return { view: Core.getCurrentFocus() };
                // }
            }

            if (
                isHorizontal &&
                next?.getParent() instanceof RecyclerView &&
                (next?.getParent() as RecyclerView)?.isHorizontal()
            ) {
                return { view: Core.getCurrentFocus() };
            }

            // TODO: double check
            return Core.getNextFocusableContext(direction);
        }

        return { view: null };
    }

    private _isInBounds(direction: string): boolean {
        const current = this.getCurrentFocusIndex();

        if (
            !this.isHorizontal() &&
            (DIRECTIONS.LEFT === direction || DIRECTIONS.RIGHT === direction)
        ) {
            return false;
        }

        if (DIRECTIONS.LEFT === direction && current === 0) {
            return false;
        }

        if (
            DIRECTIONS.RIGHT === direction &&
            current === this.getLayouts().length - 1
        ) {
            return false;
        }

        return true;
    }

    public scrollToInitialRenderIndex(): void {
        const interval = setInterval(() => {
            const currentChildren = this.getChildren().find(
                (ch) =>
                    ch.getType() === MODEL_TYPES.VIEW &&
                    (ch as ViewType).getRepeatContext()?.index ===
                        this.getInitialRenderIndex()
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

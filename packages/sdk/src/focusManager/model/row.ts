import AbstractFocusModel from './AbstractFocusModel';
import Recycler from './recycler';
import Core from './core';
import Scroller from './scroller';

class Row extends Recycler {
    constructor(params: any) {
        super(params);

        this._type = 'row';
    }

    public getType(): string {
        return this._type;
    }

    public getLastFocused(): AbstractFocusModel {
        return this?.getFocusedView() ?? this.getChildren()[0];
    }

    private getCurrentFocusIndex(): number {
        return Core.getCurrentFocus()?.getRepeatContext()?.index || 0;
    }

    public getNextFocusable(direction: string): AbstractFocusModel | undefined | null {
        if (this._isInBounds(direction) && ['right', 'left'].includes(direction)) {
            const maxOrder = Math.max(
                ...Object.values(Core.getFocusMap()).map((o: any) => (isNaN(o.getOrder()) ? 0 : o.getOrder()))
            );

            const candidates = Object.values(Core.getFocusMap()).filter(
                (c) =>
                    c.isInForeground() &&
                    c.isFocusable() &&
                    c.getParent()?.getId() === Core.getCurrentFocus()?.getParent()?.getId() &&
                    c.getOrder() === maxOrder
            );

            return Core.getNextFocusableContext(direction, true, candidates);
        } else if (!this._isInBounds(direction) || ['up', 'down'].includes(direction)) {
            const nextFocus = Core.getNextFocusableContext(direction, true);

            if (
                ['right', 'left'].includes(direction) &&
                nextFocus?.getParent()?.isRecyclable() &&
                nextFocus?.getParent()?.isHorizontal()
            ) {
                return Core.getCurrentFocus();
            }

            if (nextFocus) {
                Core.executeFocus(nextFocus);
                Core.executeScroll(direction);
                Core.executeUpdateGuideLines();
            }
        }
    }

    private _isInBounds(direction: string): boolean {
        const current = this.getCurrentFocusIndex();

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
        const target = { x: layout.x - horizontalOffset, y: 0 };
        setTimeout(() => {
            Scroller.scrollRecycler(target, this);
        }, 0);
    }
}

export default Row;

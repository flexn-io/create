import Recycler from './recycler';
import Row from './row';
import Core from './core';
import AbstractFocusModel from './AbstractFocusModel';

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
        return Core.getCurrentFocus()?.getParent()?.getRepeatContext()?.index || 0;
    }

    public getNextFocusable(direction: string): AbstractFocusModel | undefined | null {
        if (this._isInBounds(direction)) {
            const candidates = Object.values(Core.getFocusMap()).filter(
                (c) =>
                    c.isInForeground() &&
                    c.isFocusable() &&
                    c.getParent()?.getParent()?.getId() === Core.getCurrentFocus()?.getParent()?.getParent()?.getId() &&
                    c.getOrder() === Core.getCurrentMaxOrder()
            );

            return Core.getNextFocusableContext(direction, candidates);
        } else if (!this._isInBounds(direction)) {
            const nextFocus = Core.getNextFocusableContext(direction);

            if (nextFocus) {
                Core.executeFocus(nextFocus);
                Core.executeScroll(direction);
                Core.executeUpdateGuideLines();
            }
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

    public getFocusTaskExecutor(direction: string) {
        return this;
    };
}

export default List;

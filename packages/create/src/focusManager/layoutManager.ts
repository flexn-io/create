import FocusModel from './model/FocusModel';
import RecyclerView from './model/recycler';
import ScrollView from './model/scrollview';
import View from './model/view';

export const findLowestRelativeCoordinates = (model: View) => {
    const screen = model.getScreen();

    if (screen) {
        const layout = screen.getPrecalculatedFocus()?.getLayout();
        const c1 = !screen.getPrecalculatedFocus();
        const c2 = layout?.yMin === model.getLayout().yMin && layout.xMin >= model.getLayout().xMin;
        const c3 = layout && layout.yMin > model.getLayout().yMin;

        if (c1 || c2 || c3) {
            model.getScreen()?.setPrecalculatedFocus(model);
        }
    }
};

const recalculateAbsolutes = (model: FocusModel) => {
    const layout = model.getLayout();

    model.updateLayoutProperty('absolute', {
        xMin: layout.xMin - layout.xOffset,
        xMax: layout.xMax - layout.xOffset,
        yMin: layout.yMin - layout.yOffset,
        yMax: layout.yMax - layout.yOffset,
        xCenter: layout.xMin - layout.xOffset + Math.floor(layout.width / 2),
        yCenter: layout.yMin - layout.yOffset + Math.floor(layout.height / 2),
    });

    // Settings that layout is fully measured for the first time
    if (!model.isLayoutMeasured()) {
        model.setIsLayoutMeasured(true);
    }
};

const recalculateLayout = (model: FocusModel, remeasure?: boolean) => {
    let offsetX = 0;
    let offsetY = 0;
    let parent = model.getParent();
    while (parent) {
        if (parent.isScrollable()) {
            if (parent instanceof ScrollView || parent instanceof RecyclerView) {
                offsetX += parent.getScrollOffsetX();
                offsetY += parent.getScrollOffsetY();
            }
        }
        parent = parent?.getParent();
    }

    // If layout is being remeasured from parent to children calculating positions
    // we should take into account scroll view offset and add it
    if (remeasure) {
        model
            .updateLayoutProperty('xMin', model.getLayout().xMin + offsetX)
            .updateLayoutProperty('xMax', model.getLayout().xMax + offsetX)
            .updateLayoutProperty('yMin', model.getLayout().yMin + offsetY)
            .updateLayoutProperty('yMax', model.getLayout().yMax + offsetY);
    }

    model.updateLayoutProperty('xOffset', offsetX).updateLayoutProperty('yOffset', offsetY);

    recalculateAbsolutes(model);
};

const measure = ({
    model,
    callback,
    resolve,
    remeasure,
}: {
    model: FocusModel;
    callback?(): void;
    resolve?: (value?: void | PromiseLike<void>) => void;
    remeasure?: boolean;
}) => {
    if (model.node.current) {
        model.node.current.measure(
            (_: number, __: number, width: number, height: number, pageX: number, pageY: number) => {
                let pgX = pageX;
                let pgY = pageY;

                if (model instanceof View && model.getRepeatContext()) {
                    const repeatContext = model.getRepeatContext();

                    if (repeatContext) {
                        const parentRecycler = repeatContext.focusContext as RecyclerView | undefined;
                        if (parentRecycler) {
                            const rLayout = parentRecycler.getLayouts()[repeatContext.index || 0] || { x: 0, y: 0 };
                            pgX = parentRecycler.getLayout().xMin + rLayout.x;
                            pgY = parentRecycler.getLayout().yMin + model.verticalContentContainerGap() + rLayout.y;
                        }
                    }
                }

                if (model.getLayout()?.width && model.getLayout().width !== width) {
                    width = model.getLayout()?.width;
                    height = model.getLayout()?.height;
                }

                model
                    .updateLayoutProperty('xMin', pgX)
                    .updateLayoutProperty('xMax', pgX + width)
                    .updateLayoutProperty('yMin', pgY)
                    .updateLayoutProperty('yMax', pgY + height)
                    .updateLayoutProperty('width', width)
                    .updateLayoutProperty('height', height)
                    .updateLayoutProperty('xCenter', pgX + Math.floor(width / 2))
                    .updateLayoutProperty('yCenter', pgY + Math.floor(height / 2));

                // Order matters first recalculate layout then find lowest possible relative coordinates
                recalculateLayout(model, remeasure);

                if (model instanceof View) {
                    findLowestRelativeCoordinates(model);
                }

                if (callback) callback();
                if (resolve) resolve();
            }
        );
    } else {
        resolve?.();
    }
};

const measureAsync = ({ model, remeasure }: { model: FocusModel; remeasure?: boolean }): Promise<void> =>
    new Promise((resolve) => measure({ model, remeasure, resolve }));

const measureSync = ({
    model,
    callback,
    remeasure,
}: {
    model: FocusModel;
    callback?(): void;
    remeasure?: boolean;
}): void => measure({ model, callback, remeasure });

export { measureAsync, measureSync, recalculateLayout };

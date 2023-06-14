import FocusModel from './model/abstractFocusModel';
import RecyclerView from './model/recycler';
import ScrollView from './model/scrollview';
import View from './model/view';

const getScrollOffsets = (model: FocusModel) => {
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

    return { x: offsetX, y: offsetY };
};

const findLowestRelativeCoordinates = (model: View) => {
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
    const { x: offsetX, y: offsetY } = getScrollOffsets(model);

    model.updateLayoutProperty('xOffset', offsetX).updateLayoutProperty('yOffset', offsetY);

    const layout = model.getLayout();

    model.updateLayoutProperty('absolute', {
        xMin: layout.xMin - layout.xOffset,
        xMax: layout.xMax - layout.xOffset,
        yMin: layout.yMin - layout.yOffset,
        yMax: layout.yMax - layout.yOffset,
        xCenter: layout.xMin - layout.xOffset + Math.floor(layout.width / 2),
        yCenter: layout.yMin - layout.yOffset + Math.floor(layout.height / 2),
    });

    // Setting that layout is fully measured for the first time
    if (!model.isLayoutMeasured()) {
        model.setIsLayoutMeasured(true);
    }
};

const measure = ({
    model,
    callback,
    resolve,
}: {
    model: FocusModel;
    callback?(): void;
    resolve?: (value?: void | PromiseLike<void>) => void;
}) => {
    if (model.node.current) {
        if (model instanceof View && model.getRepeatContext()) {
            let pgX = 0;
            let pgY = 0;
            let width = 0;
            let height = 0;

            const repeatContext = model.getRepeatContext();

            if (repeatContext) {
                const parentRecycler = repeatContext.focusContext as RecyclerView | undefined;
                if (parentRecycler) {
                    const {
                        x,
                        y,
                        width: layoutWidth,
                        height: layoutHeight,
                    } = parentRecycler.getLayouts()[repeatContext.index || 0] || {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0,
                    };
                    pgX = parentRecycler.getLayout().xMin + x;
                    pgY = parentRecycler.getLayout().yMin + model.verticalContentContainerGap() + y;
                    width = layoutWidth;
                    height = layoutHeight - model.verticalContentContainerGap() * 2;
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
            recalculateAbsolutes(model);
            findLowestRelativeCoordinates(model);
            if (callback) callback();
            if (resolve) resolve();
        } else {
            model.node.current.measure(
                (_: number, __: number, width: number, height: number, pageX: number, pageY: number) => {
                    const { x: offsetX, y: offsetY } = getScrollOffsets(model);

                    const pgX = pageX + offsetX;
                    const pgY = pageY + offsetY;

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
                    recalculateAbsolutes(model);

                    if (model instanceof View) {
                        findLowestRelativeCoordinates(model);
                    }

                    if (callback) callback();
                    if (resolve) resolve();
                }
            );
        }
    } else {
        resolve?.();
    }
};

const measureAsync = ({ model }: { model: FocusModel }): Promise<void> =>
    new Promise((resolve) => measure({ model, resolve }));

const measureSync = ({ model, callback }: { model: FocusModel; callback?(): void }): void =>
    measure({ model, callback });

export { measureAsync, measureSync, recalculateAbsolutes, findLowestRelativeCoordinates };

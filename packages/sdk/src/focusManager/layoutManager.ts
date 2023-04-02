import FocusModel, { TYPE_SCROLL_VIEW, TYPE_VIEW } from './model/AbstractFocusModel';
import RecyclerView from './model/recycler';
import ScrollView from './model/scrollview';
import View from './model/view';

export function findLowestRelativeCoordinates(model: View) {
    const screen = model.getScreen();

    if (screen) {
        const layout = screen.getPrecalculatedFocus()?.getLayout();
        const c1 = !screen.getPrecalculatedFocus();
        const c2 = layout?.yMin === model.getLayout()?.yMin && layout?.xMin >= model.getLayout()?.xMin;
        const c3 = layout?.yMin > model.getLayout()?.yMin;

        if (c1 || c2 || c3) {
            model.getScreen()?.setPrecalculatedFocus(model);
        }
    }
}

function recalculateAbsolutes(model: FocusModel) {
    const layout = model.getLayout();

    model.updateLayoutProperty('absolute', {
        xMin: layout.xMin - layout.xOffset,
        xMax: layout.xMax - layout.xOffset,
        yMin: layout.yMin - layout.yOffset,
        yMax: layout.yMax - layout.yOffset,
        xCenter: layout.xCenter - layout.xOffset,
        yCenter: layout.yCenter - layout.yOffset,
    });
}

function recalculateLayout(model: FocusModel, remeasure?: boolean) {
    if (!model?.getLayout()) {
        return;
    }
    // This is needed because ScrollView offsets
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

    // If layout is being remeasured from parent to children calculating min positions
    // we should take into account scroll view offset and add it
    if (remeasure) {
        model
            .updateLayoutProperty('xMin', model.getLayout().xMin + offsetX)
            .updateLayoutProperty('yMin', model.getLayout().yMin + offsetY);
    }

    model.updateLayoutProperty('xOffset', offsetX).updateLayoutProperty('yOffset', offsetY);

    recalculateAbsolutes(model);
}

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
                let pgX;
                let pgY;

                if ((model instanceof RecyclerView || model instanceof View) && model.getRepeatContext()) {
                    const repeatContext = model.getRepeatContext();
                    if (repeatContext) {
                        const parentRecycler = repeatContext.focusContext as RecyclerView | undefined;
                        if (parentRecycler) {
                            const rLayout = parentRecycler.getLayouts()[repeatContext.index || 0];
                            pgX = parentRecycler.getLayout().xMin + rLayout.x;
                            pgY = parentRecycler.getLayout().yMin + rLayout.y;
                        }
                    }
                } else {
                    pgY = pageY;
                    pgX = pageX;
                }

                if (model.getLayout()?.width && model.getLayout().width !== width) {
                    width = model.getLayout()?.width;
                    height = model.getLayout()?.height;
                }

                const layout = {
                    xMin: pgX,
                    xMax: pgX + width,
                    yMin: pgY,
                    yMax: pgY + height,
                    width,
                    height,
                    yOffset: 0,
                    xOffset: 0,
                    xMaxScroll: 0,
                    yMaxScroll: 0,
                    scrollContentHeight: 0,
                    xCenter: pgX + Math.floor(width / 2),
                    yCenter: pgY + Math.floor(height / 2),
                    innerView: {
                        yMin: 0,
                        yMax: 0,
                        xMin: 0,
                        xMax: 0,
                    },
                };

                //         // TODO: move it out from here
                //         // const parent = model.getParent();
                //         // if (parent?.isScrollable() && parent?.getLayout()) {
                //         //     const pCtx = model?.getRepeatContext()?.focusContext;
                //         //     if (pCtx && pCtx instanceof Recycler) {
                //         //         const rLayout = pCtx.getLayouts()[pCtx.getLayouts().length - 1];
                //         //         parent.updateLayoutProperty('xMaxScroll', pCtx.getLayout().xMin + width + rLayout.x);
                //         //     }
                //         // }

                model.setLayout(layout);

                if (model.getType() === TYPE_VIEW) {
                    findLowestRelativeCoordinates(model as View);
                }

                recalculateLayout(model, remeasure);

                if (callback) callback();
                if (resolve) resolve();
            }
        );

        // get the layout of innerView in scroll
        if (model.getType() === TYPE_SCROLL_VIEW)
            // eslint-disable-next-line no-underscore-dangle
            model.node.current._children[0].measure(
                (_: number, __: number, width: number, height: number, pageX: number, pageY: number) => {
                    model.updateLayoutProperty('innerView', {
                        yMax: pageY + height - model.getLayout().yMax,
                        yMin: pageY + pageY,
                        xMax: pageX + width - model.getLayout().xMax,
                        xMin: pageX,
                    });
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

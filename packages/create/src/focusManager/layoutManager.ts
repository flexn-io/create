import FocusModel from './model/abstractFocusModel';

const getScrollOffsets = (model: FocusModel) => {
    let offsetX = 0;
    let offsetY = 0;
    let parent = model.getParent();
    while (parent) {
        if (parent.isScrollable()) {
            offsetX += parent.getScrollOffsetX();
            offsetY += parent.getScrollOffsetY();
        }
        parent = parent?.getParent();
    }

    return { x: offsetX, y: offsetY };
};

const findLowestRelativeCoordinates = (model: FocusModel) => {
    const screen = model.getScreen();

    if (screen) {
        const layout = screen.getPrecalculatedFocus()?.getLayout();
        const c1 = !screen.getPrecalculatedFocus();
        const c2 =
            layout?.yMin === model.getLayout().yMin &&
            layout.xMin >= model.getLayout().xMin;
        const c3 = layout && layout.yMin > model.getLayout().yMin;

        if (c1 || c2 || c3) {
            model.getScreen()?.setPrecalculatedFocus(model as never);
        }
    }
};

const recalculateAbsolutes = (model: FocusModel) => {
    const { x: offsetX, y: offsetY } = getScrollOffsets(model);

    model
        .updateLayoutProperty('xOffset', offsetX)
        .updateLayoutProperty('yOffset', offsetY);

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

const nodeMeasure = (
    model: FocusModel,
    callback: (
        _: number,
        __: number,
        width: number,
        height: number,
        pageX: number,
        pageY: number
    ) => void
) => {
    if (model.getType() === 'view' && model.getRepeatContext()) {
        const repeatContext = model.getRepeatContext();
        if (repeatContext) {
            const parentRecycler = repeatContext.focusContext;
            if (parentRecycler) {
                const { width, height } = parentRecycler.getLayouts()[
                    repeatContext.index || 0
                ] || { x: 0, y: 0 };

                callback(
                    0,
                    0,
                    width - model.horizontalContentContainerGap() * 2,
                    height,
                    0,
                    0
                );
            }
        }
    } else {
        model.node.current.measure(
            (
                ...params: [
                    x: number,
                    y: number,
                    width: number,
                    height: number,
                    pageX: number,
                    pageY: number
                ]
            ) => {
                callback(
                    params[0],
                    params[1],
                    params[2],
                    params[3],
                    params[4],
                    params[5]
                );
            }
        );
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
        nodeMeasure(
            model,
            (
                _x: number,
                _y: number,
                width: number,
                height: number,
                pageX: number,
                pageY: number
            ) => {
                const { x: offsetX, y: offsetY } = getScrollOffsets(model);
                let pgX = pageX + offsetX;
                let pgY = pageY + offsetY;

                if (model.getType() === 'view' && model.getRepeatContext()) {
                    const repeatContext = model.getRepeatContext();

                    if (repeatContext) {
                        const parentRecycler = repeatContext.focusContext;
                        if (parentRecycler) {
                            const rLayout = parentRecycler.getLayouts()[
                                repeatContext.index || 0
                            ] || { x: 0, y: 0 };

                            pgX =
                                parentRecycler.getLayout().xMin +
                                rLayout.x +
                                model.horizontalContentContainerGap() +
                                parentRecycler.getAutoLayoutSize() +
                                (parentRecycler.isHorizontal()
                                    ? parentRecycler.getListHeaderDimensions()
                                          .width
                                    : 0);
                            pgY =
                                parentRecycler.getLayout().yMin +
                                rLayout.y +
                                model.verticalContentContainerGap() +
                                parentRecycler.getAutoLayoutSize() +
                                (!parentRecycler.isHorizontal()
                                    ? parentRecycler.getListHeaderDimensions()
                                          .height
                                    : 0);
                        }
                    }
                }

                model
                    .updateLayoutProperty('xMin', pgX)
                    .updateLayoutProperty('xMax', pgX + width)
                    .updateLayoutProperty('yMin', pgY)
                    .updateLayoutProperty('yMax', pgY + height)
                    .updateLayoutProperty('width', width)
                    .updateLayoutProperty('height', height)
                    .updateLayoutProperty(
                        'xCenter',
                        pgX + Math.floor(width / 2)
                    )
                    .updateLayoutProperty(
                        'yCenter',
                        pgY + Math.floor(height / 2)
                    );

                // Order matters first recalculate layout then find lowest possible relative coordinates
                recalculateAbsolutes(model);

                if (model.getType() === 'view') {
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

const measureAsync = ({ model }: { model: FocusModel }): Promise<void> =>
    new Promise((resolve) => measure({ model, resolve }));

const measureSync = ({
    model,
    callback,
}: {
    model: FocusModel;
    callback?(): void;
}): void => measure({ model, callback });

export {
    measureAsync,
    measureSync,
    recalculateAbsolutes,
    findLowestRelativeCoordinates,
};

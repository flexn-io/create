import AbstractFocusModel, { TYPE_RECYCLER, TYPE_SCROLL_VIEW, TYPE_VIEW } from './model/AbstractFocusModel';
import Recycler from './model/recycler';
import Screen from './model/screen';
import ScrollView from './model/scrollview';
import View from './model/view';

export function findLowestRelativeCoordinates(model: View) {
    const screen = model.getScreen() as Screen;

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

function recalculateAbsolutes(model: AbstractFocusModel) {
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

function recalculateLayout(cls: AbstractFocusModel, remeasuring?: boolean) {
    if (!cls?.getLayout()) {
        return;
    }
    // This is needed because ScrollView offsets
    let offsetX = 0;
    let offsetY = 0;
    let parent = cls.getParent();
    while (parent) {
        if (parent.isScrollable()) {
            if (parent instanceof ScrollView || parent instanceof Recycler) {
                offsetX += parent.getScrollOffsetX();
                offsetY += parent.getScrollOffsetY();
            }
        }
        parent = parent?.getParent();
    }

    // If layout is being remeasured from parent to children calculating min positions
    // we should take into account scroll view offset and add it
    if (remeasuring) {
        cls.updateLayoutProperty('xMin', cls.getLayout().xMin + offsetX).updateLayoutProperty(
            'yMin',
            cls.getLayout().yMin + offsetY
        );
    }

    cls.updateLayoutProperty('xOffset', offsetX).updateLayoutProperty('yOffset', offsetY);

    recalculateAbsolutes(cls);
}

function _measure(
    model: AbstractFocusModel,
    ref: any,
    unmeasurableRelatives?: { x: number; y: number },
    callback?: () => void,
    resolve?: any,
    remeasuring?: boolean
) {
    if (!ref?.current) {
        if (resolve) resolve();
        return;
    }

    ref.current.measure((_: number, __: number, width: number, height: number, pageX: number, pageY: number) => {
        let pgX;
        let pgY;

        const repeatContext = model.getRepeatContext();
        if (repeatContext !== undefined) {
            const pCtx = repeatContext.focusContext;
            if (pCtx !== undefined) {
                const rLayout = pCtx.getLayouts()[repeatContext.index || 0];
                pgX = pCtx.getLayout().xMin + rLayout.x;
                pgY = pCtx.getLayout().yMin + rLayout.y;
            }
        } else {
            pgY = pageY;
            pgX = pageX;
        }

        // Single and nested recyclers can't measure itself due to logic above
        if (unmeasurableRelatives && model.getType() === TYPE_RECYCLER) {
            pgX = pgX + unmeasurableRelatives.x;
            pgY = pgY + unmeasurableRelatives.y;
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

        // TODO: move it out from here
        const parent = model.getParent();
        if (parent?.isScrollable() && parent?.getLayout()) {
<<<<<<< HEAD
            const pCtx = model?.getRepeatContext()?.parentContext;
            if (pCtx && pCtx instanceof Recycler) {
=======
            const pCtx = cls?.getRepeatContext()?.focusContext;
            if (pCtx) {
>>>>>>> feat/flash-list-impl
                const rLayout = pCtx.getLayouts()[pCtx.getLayouts().length - 1];
                parent.updateLayoutProperty('xMaxScroll', pCtx.getLayout().xMin + width + rLayout.x);
            }
        }

        model.setLayout(layout);

        if (model.getType() === TYPE_VIEW) {
            findLowestRelativeCoordinates(model as View);
        }

        recalculateLayout(model, remeasuring);

        if (callback) callback();
        if (resolve) resolve(true);
    });

    // get the layout of innerView in scroll
    if (model.getType() === TYPE_SCROLL_VIEW)
        // eslint-disable-next-line no-underscore-dangle
        ref.current._children[0].measure(
            (_: number, __: number, width: number, height: number, pageX: number, pageY: number) => {
                model.updateLayoutProperty('innerView', {
                    yMax: pageY + height - model.getLayout().yMax,
                    yMin: pageY + pageY,
                    xMax: pageX + width - model.getLayout().xMax,
                    xMin: pageX,
                });
            }
        );
}

export function measureAsync(
    model: AbstractFocusModel,
    ref: any,
    unmeasurableRelatives?: { x: number; y: number },
    callback?: () => void,
    remeasuring?: boolean
) {
    return new Promise((resolve) => {
        _measure(model, ref, unmeasurableRelatives, callback, resolve, remeasuring);
    });
}

function measure(
    model: AbstractFocusModel,
    ref: any,
    unmeasurableRelatives?: { x: number; y: number },
    callback?: () => void,
    remeasuring?: boolean
) {
    _measure(model, ref, unmeasurableRelatives, callback, null, remeasuring);
}

export { measure, recalculateLayout };

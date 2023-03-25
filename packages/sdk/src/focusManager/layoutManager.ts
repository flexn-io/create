import { CONTEXT_TYPES } from './constants';
import AbstractFocusModel from './model/AbstractFocusModel';
import Screen from './model/screen';
import View from './model/view';

export function findLowestRelativeCoordinates(cls: AbstractFocusModel) {
    const screen = cls.getScreen() as Screen;

    if (screen && cls.getType() === CONTEXT_TYPES.VIEW) {
        const layout = screen.getPrecalculatedFocus()?.getLayout();

        // console.log('xMin5', layout?.xMin)

        const c1 = !screen.getPrecalculatedFocus();
        const c2 = layout?.yMin === cls.getLayout()?.yMin && layout?.xMin >= cls.getLayout()?.xMin;
        const c3 = layout?.yMin > cls.getLayout()?.yMin;

        if (c1 || c2 || c3) {
            cls.getScreen()?.setPrecalculatedFocus(cls as View);
        }
    }
}

function recalculateAbsolutes(cls: AbstractFocusModel) {
    const layout = cls.getLayout();

    // console.log('xMin4', layout?.xMin)

    // console.log({ id: cls.getId(), pgX: layout.xMin, pgY: layout.yMin });

    cls.updateLayoutProperty('absolute', {
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
            offsetX += parent.getScrollOffsetX() || 0;
            offsetY += parent.getScrollOffsetY() || 0;
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
    cls: AbstractFocusModel,
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

        const repeatContext = cls.getRepeatContext();
        if (repeatContext !== undefined) {
            const pCtx = repeatContext.focusContext;
            if (pCtx !== undefined) {
                const rLayout = pCtx.getLayouts()[repeatContext.index || 0];
                // console.log('XMIN', pCtx.getLayout().xMin);
                pgX = pCtx.getLayout().xMin + rLayout.x;
                pgY = pCtx.getLayout().yMin + rLayout.y;
            }
        } else {
            pgY = pageY;
            pgX = pageX;
            // console.log('XMIN', cls.getId(), pgX);
        }

        // Single and nested recyclers can't measure itself due to logic above
        if (unmeasurableRelatives && cls.getType() === CONTEXT_TYPES.RECYCLER) {
            pgX = pgX + unmeasurableRelatives.x;
            pgY = pgY + unmeasurableRelatives.y;
        }

        if (cls.getLayout()?.width && cls.getLayout().width !== width) {
            width = cls.getLayout()?.width;
            height = cls.getLayout()?.height;
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
        const parent = cls.getParent();
        if (parent?.isScrollable() && parent?.getLayout()) {
            const pCtx = cls?.getRepeatContext()?.focusContext;
            if (pCtx) {
                const rLayout = pCtx.getLayouts()[pCtx.getLayouts().length - 1];
                parent.updateLayoutProperty('xMaxScroll', pCtx.getLayout().xMin + width + rLayout.x);
            }
        }

        cls.setLayout(layout);

        findLowestRelativeCoordinates(cls);

        recalculateLayout(cls, remeasuring);

        if (callback) callback();
        if (resolve) resolve(true);
    });

    // get the layout of innerView in scroll
    if (cls.getType() === 'scrollView')
        // eslint-disable-next-line no-underscore-dangle
        ref.current._children[0].measure(
            (_: number, __: number, width: number, height: number, pageX: number, pageY: number) => {
                cls.updateLayoutProperty('innerView', {
                    yMax: pageY + height - cls.getLayout().yMax,
                    yMin: pageY + pageY,
                    xMax: pageX + width - cls.getLayout().xMax,
                    xMin: pageX,
                });
            }
        );
}

export function measureAsync(
    cls: AbstractFocusModel,
    ref: any,
    unmeasurableRelatives?: { x: number; y: number },
    callback?: () => void,
    remeasuring?: boolean
) {
    return new Promise((resolve) => {
        _measure(cls, ref, unmeasurableRelatives, callback, resolve, remeasuring);
    });
}

function measure(
    cls: AbstractFocusModel,
    ref: any,
    unmeasurableRelatives?: { x: number; y: number },
    callback?: () => void,
    remeasuring?: boolean
) {
    _measure(cls, ref, unmeasurableRelatives, callback, null, remeasuring);
}

export { measure, recalculateLayout };

import { CONTEXT_TYPES } from './constants';
import AbstractFocusModel from './Model/AbstractFocusModel';
import { ScreenCls } from './Model/screen';
import { ViewCls } from './Model/view';

export function findLowestRelativeCoordinates(cls: AbstractFocusModel) {
    const screen = cls.getScreen() as ScreenCls;

    if (screen && cls.getType() === CONTEXT_TYPES.VIEW) {
        const layout = screen.getPrecalculatedFocus()?.getLayout();

        const c1 = !screen.getPrecalculatedFocus();
        const c2 = layout?.yMin === cls.getLayout()?.yMin && layout?.xMin >= cls.getLayout()?.xMin;
        const c3 = layout?.yMin > cls.getLayout()?.yMin;

        if (c1 || c2 || c3) {
            cls.getScreen()?.setPrecalculatedFocus(cls as ViewCls);
        }
    }
}

function recalculateAbsolutes(cls: AbstractFocusModel) {
    const layout = cls.getLayout();
    cls.updateLayoutProperty('absolute', {
        xMin: layout.xMin - layout.xOffset,
        xMax: layout.xMax - layout.xOffset,
        yMin: layout.yMin - layout.yOffset,
        yMax: layout.yMax - layout.yOffset,
        xCenter: layout.xCenter - layout.xOffset,
        yCenter: layout.yCenter - layout.yOffset,
    });
}

function recalculateLayout(cls: AbstractFocusModel) {
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

    cls.updateLayoutProperty('xOffset', offsetX).updateLayoutProperty('yOffset', offsetY);

    recalculateAbsolutes(cls);
}

function measure(cls: AbstractFocusModel, ref: any, unmeasurableRelatives?: { x: number; y: number }) {
    ref.current.measure((_: number, __: number, width: number, height: number, pageX: number, pageY: number) => {
        let pgX;
        let pgY;

        const repeatContext = cls.getRepeatContext();
        if (repeatContext !== undefined) {
            const pCtx = repeatContext.parentContext;
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
        if (unmeasurableRelatives && cls.getType() === CONTEXT_TYPES.RECYCLER) {
            pgX = pgX + unmeasurableRelatives.x;
            pgY = pgY + unmeasurableRelatives.y;
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
            xCenter: pgX + Math.floor(width / 2),
            yCenter: pgY + Math.floor(height / 2),
            innerView: {
                yMin: 0,
                yMax: 0,
                xMin: 0,
                xMax: 0,
            },
        };

        if (cls.getLayout()) {
            layout.yOffset = cls.getLayout().yOffset;
        }

        // TODO: move it out from here
        const parent = cls.getParent();
        if (parent?.isScrollable() && parent?.getLayout()) {
            const pCtx = cls?.getRepeatContext()?.parentContext;
            if (pCtx) {
                const rLayout = pCtx.getLayouts()[pCtx.getLayouts().length - 1];
                parent.updateLayoutProperty('xMaxScroll', pCtx.getLayout().xMin + width + rLayout.x);
            }
        }

        cls.setLayout(layout);
        findLowestRelativeCoordinates(cls);
        recalculateLayout(cls);
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

export { measure, recalculateLayout };

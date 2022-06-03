import type { Context } from './types';
import { CONTEXT_TYPES } from './constants';
import AbstractFocusModel from './Model/AbstractFocusModel';
import { ViewCls } from './Model/view';

function findLowestRelativeCoordinates(cls: AbstractFocusModel) {
    if (cls.screen && cls.type === CONTEXT_TYPES.VIEW) {
        const { screen } = cls;
        const { layout } = screen.getFirstFocusable() || {};

        const c1 = !screen.getFirstFocusable();
        const c2 = layout?.yMin === cls.layout?.yMin && layout.xMin >= cls.layout?.xMin;
        const c3 = layout?.yMin > cls.layout?.yMin;

        if (c1 || c2 || c3) {
            cls.getScreen()?.setFirstFocusable(cls as ViewCls);
        }
    }
}

function recalculateAbsolutes(cls: AbstractFocusModel) {
    const { layout } = cls;

    layout.absolute = {
        xMin: layout.xMin - layout.xOffset,
        xMax: layout.xMax - layout.xOffset,
        yMin: layout.yMin - layout.yOffset,
        yMax: layout.yMax - layout.yOffset,
        xCenter: layout.xCenter - layout.xOffset,
        yCenter: layout.yCenter - layout.yOffset,
    };
}

function recalculateLayout(cls: AbstractFocusModel) {
    if (!cls?.layout) {
        return;
    }
    // This is needed because ScrollView offsets
    let offsetX = 0;
    let offsetY = 0;
    let { parent } = cls;
    while (parent) {
        if (parent.isScrollable()) {
            offsetX += parent.getScrollOffsetX() || 0;
            offsetY += parent.getScrollOffsetY() || 0;
        }
        parent = parent?.parent;
    }
    cls.layout.xOffset = offsetX;
    cls.layout.yOffset = offsetY;

    recalculateAbsolutes(cls);
}

function measure(cls: AbstractFocusModel, ref: any, unmeasurableRelatives?: { x: number; y: number }) {
    ref.current.measure((_: number, __: number, width: number, height: number, pageX: number, pageY: number) => {
        let pgX;
        let pgY;

        if (cls.repeatContext !== undefined) {
            const pCtx = cls.repeatContext.parentContext;

            if (pCtx !== undefined) {
                const rLayout = pCtx.getLayouts()[cls.repeatContext.index || 0];
                pgX = pCtx.layout.xMin + rLayout.x;
                pgY = pCtx.layout.yMin + rLayout.y;
            }
        } else {
            pgY = pageY;
            pgX = pageX;
        }

        // Single and nested recyclers can't measure itself due to logic above
        if (unmeasurableRelatives && cls.type === CONTEXT_TYPES.RECYCLER) {
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

        cls.setLayout(layout);

        findLowestRelativeCoordinates(cls);

        // Calculate max X and Y width to prevent over scroll
        if (cls.parent?.isScrollable() && cls.parent.layout) {
            const pCtx = cls?.repeatContext?.parentContext;
            if (pCtx) {
                const rLayout = pCtx.getLayouts()[pCtx.getLayouts().length - 1];
                cls.parent.layout.xMaxScroll = pCtx.layout.xMin + width + rLayout.x;
                cls.parent.layout.yMaxScroll = pCtx.layout.yMin + height + rLayout.y;
            }
        }

        recalculateLayout(cls);
    });

    // get the layout of innerView in scroll
    if (cls.type === 'scrollView')
        // eslint-disable-next-line no-underscore-dangle
        ref.current._children[0].measure(
            (_: number, __: number, width: number, height: number, pageX: number, pageY: number) => {
                cls.layout.innerView.yMax = pageY + height - cls.layout.yMax;
                cls.layout.innerView.yMin = pageY;
                cls.layout.innerView.xMax = pageX + width - cls.layout.xMax;
                cls.layout.innerView.xMin = pageX;
            }
        );
}

export { measure, recalculateLayout };

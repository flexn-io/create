import type { Context } from './types';
import { CONTEXT_TYPES } from './constants';

function findLowestRelativeCoordinates(context: Context) {
    if (context.screen && context.type === CONTEXT_TYPES.VIEW) {
        const { screen } = context;
        const { layout } = screen.firstFocusable || {};
        if (!screen.firstFocusable) {
            context.screen.firstFocusable = context;
        } else if (layout.yMin === context.layout.yMin && layout.xMin >= context.layout.xMin) {
            context.screen.firstFocusable = context;
        } else if (layout.yMin > context.layout.yMin) {
            context.screen.firstFocusable = context;
        }
    }
}

function recalculateAbsolutes(context: Context) {
    const { layout } = context;

    layout.absolute = {
        xMin: layout.xMin - layout.xOffset,
        xMax: layout.xMax - layout.xOffset,
        yMin: layout.yMin - layout.yOffset,
        yMax: layout.yMax - layout.yOffset,
        xCenter: layout.xCenter - layout.xOffset,
        yCenter: layout.yCenter - layout.yOffset,
    };
}

function recalculateLayout(context: Context) {
    if (!context?.layout) {
        return;
    }
    // This is needed because ScrollView offsets
    let offsetX = 0;
    let offsetY = 0;
    let { parent } = context;
    while (parent) {
        if (parent.isScrollable) {
            offsetX += parent.scrollOffsetX || 0;
            offsetY += parent.scrollOffsetY || 0;
        }
        parent = parent?.parent;
    }
    context.layout.xOffset = offsetX;
    context.layout.yOffset = offsetY;
    
    recalculateAbsolutes(context);
}

function measure(context: Context, ref: any) {
    ref.current.measure((_: number, __: number, width: number, height: number, pageX: number, pageY: number) => {
        let pgX;
        let pgY;

        if (context.repeatContext !== undefined) {
            // TODO: Check what about nested repeats?
            const pCtx = context.repeatContext.parentContext;

            if (pCtx !== undefined) {
                const rLayout = pCtx.layouts[context.repeatContext.index || 0];
                pgX = pCtx.layout.xMin + rLayout.x;
                pgY = pCtx.layout.yMin + rLayout.y;
            }
        } else {
            pgY = pageY;
            pgX = pageX;
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
        if (context.layout) {
            layout.yOffset = context.layout.yOffset;
        }

        context.layout = layout;

        findLowestRelativeCoordinates(context);

        // Calculate max X and Y width to prevent over scroll
        if (context.parent?.isScrollable && context.parent.layout) {
            const pCtx = context?.repeatContext?.parentContext;
            if (pCtx) {
                const rLayout = pCtx.layouts[pCtx.layouts.length - 1];
                context.parent.layout.xMaxScroll = pCtx.layout.xMin + width + rLayout.x;
                context.parent.layout.yMaxScroll = pCtx.layout.yMin + height + rLayout.y;
            }
        }

        recalculateLayout(context);
    });

    // get the layout of innerView in scroll
    if (context.type === 'scrollView')
        // eslint-disable-next-line no-underscore-dangle
        ref.current._children[0].measure(
            (_: number, __: number, width: number, height: number, pageX: number, pageY: number) => {
                context.layout.innerView.yMax = pageY + height - context.layout.yMax;
                context.layout.innerView.yMin = pageY;
                context.layout.innerView.xMax = pageX + width - context.layout.xMax;
                context.layout.innerView.xMin = pageX;
            }
        );
}

export { measure, recalculateLayout };

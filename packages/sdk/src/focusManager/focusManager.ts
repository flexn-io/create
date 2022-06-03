import { Dimensions } from 'react-native';
import {
    DIRECTION_VERTICAL,
    DIRECTION_HORIZONTAL,
    CUTOFF_SIZE,
    WINDOW_ALIGNMENT,
    DIRECTION_UP,
    DIRECTION_DOWN,
    DIRECTION_LEFT,
    DIRECTION_RIGHT,
    DEFAULT_VIEWPORT_OFFSET,
} from './constants';
import logger from './logger';
import type { FocusableMap } from './types';
import { recalculateLayout } from './layoutManager';
import AbstractFocusModel from './Model/AbstractFocusModel';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const intersects = (guideLine: number, sizeOfCurrent: number, startOfNext: number, endOfNext: number) => {
    const a1 = guideLine - sizeOfCurrent * 0.5;
    const a2 = guideLine + sizeOfCurrent * 0.5;

    return (
        (a1 >= startOfNext && a1 <= endOfNext) ||
        (a2 >= startOfNext && a2 <= endOfNext) ||
        (a1 <= startOfNext && a2 >= endOfNext)
    );
};

const intersectsOffset = (guideLine: number, startOfNext: number, endOfNext: number) =>
    Math.abs(guideLine - Math.round((startOfNext + endOfNext) / 2));

const nextIsVisible = (nextMax: number, direction: string) => {
    if (DIRECTION_VERTICAL.includes(direction)) {
        return nextMax > 0 && nextMax <= windowWidth;
    }

    return true;
};

const isInOneLine = (direction: string, nextCls: AbstractFocusModel, currentContext: AbstractFocusModel) => {
    const currentLayout = currentContext.getLayout();
    const nextLayout = nextCls.getLayout();

    if (nextCls.getChildren().length > 0) {
        return false;
    }

    if (DIRECTION_VERTICAL.includes(direction)) {
        const diff = Math.abs(nextLayout.yMin - currentLayout.yMin);
        return diff <= 20;
    }

    const diff = Math.abs(nextLayout.xMin - currentLayout.xMin);

    return diff <= 20;
};

const findFirstFocusableInGroup = (cls: AbstractFocusModel): AbstractFocusModel | null | undefined => {
    for (let index = 0; index < cls.getChildren().length; index++) {
        const ch: AbstractFocusModel = cls.getChildren()[index];
        if (ch.isFocusable()) {
            return ch;
        }

        const next = findFirstFocusableInGroup(ch);

        if (next?.isFocusable()) {
            return next;
        }
    }

    if (cls.isFocusable()) {
        return cls;
    }

    return null;
};

export const distCalc = (
    output: any,
    nextCls: AbstractFocusModel,
    guideLine: number,
    currentRectDimension: number,
    p3: number,
    p4: number,
    p5: number,
    p6: number,
    p7: number,
    p8: number,
    p9: number,
    p12: number,
    direction: string,
    contextParameters: any
) => {
    const { currentFocusable }: { currentFocusable: AbstractFocusModel } = contextParameters;
    // First we search based on the distance to guide line
    const ix = intersects(guideLine, currentRectDimension, p3, p4);
    const ixOffset = intersectsOffset(guideLine, p3, p4);
    const nextVisible = nextIsVisible(p12, direction);
    const inOneLine = isInOneLine(direction, nextCls, currentFocusable);

    const closestDistance = Math.abs(p5 - p6);
    const cornerDistance = p7 - p8;

    if (
        ix &&
        !inOneLine &&
        cornerDistance < 0 &&
        output.match1 >= closestDistance &&
        output.match1IxOffset >= ixOffset
    ) {
        output.match1 = closestDistance;
        output.match1Context = nextCls;
        output.match1IxOffset = ixOffset;
        logger.debug('FOUND CLOSER M1', nextCls.getId(), closestDistance);
    }

    // Next up based on component size and it's center point
    const ix2 = intersects(p9, currentRectDimension, p3, p4);
    if (
        ix2 &&
        !inOneLine &&
        nextVisible &&
        cornerDistance < 0 &&
        output.match2 >= closestDistance &&
        output.match2IxOffset >= ixOffset
    ) {
        output.match2 = closestDistance;
        output.match2Context = nextCls;
        logger.debug('FOUND CLOSER M2', nextCls.getId(), closestDistance);
    }
    // Finally a search is based on arbitrary cut off size, so we could focus not entirely aligned items
    const ix3 = intersects(p9, CUTOFF_SIZE, p3, p4);

    if (
        ix3 &&
        !inOneLine &&
        nextVisible &&
        cornerDistance < 0 &&
        output.match3 >= closestDistance &&
        output.match3IxOffset >= ixOffset
    ) {
        if (nextCls.isFocusable()) {
            output.match3 = closestDistance;
            output.match3Context = nextCls;
            logger.debug('FOUND CLOSER M3', nextCls.getId(), closestDistance);
        } else {
            const firstInNextGroup = findFirstFocusableInGroup(nextCls);
            if (firstInNextGroup) {
                contextParameters.findClosestNode(firstInNextGroup, direction, output);
            }
        }
    }
};

const executeScroll = (direction: string, contextParameters: any) => {
    const {
        currentFocusable,
        focusableMap,
        isDebuggerEnabled,
    }: {
        currentFocusable: AbstractFocusModel;
        focusableMap: FocusableMap;
        isDebuggerEnabled: boolean;
    } = contextParameters;

    if (!currentFocusable?.getLayout()) {
        //eslint-disable-next-line
        console.warn('Current context were removed during scroll find');
        return;
    }
    const scrollContextParents = [];
    let parent = currentFocusable?.getParent();
    // We can only scroll 2 ScrollView at max. one Horz and Vert
    const directionsFilled: any[] = [];
    while (parent) {
        if (parent.isScrollable() && !directionsFilled.includes(parent.isHorizontal())) {
            directionsFilled.push(parent.isHorizontal());
            scrollContextParents.push(parent);
        }
        parent = parent?.getParent();
    }

    scrollContextParents.forEach((p: AbstractFocusModel) => {
        const scrollTarget = p.isHorizontal()
            ? calculateHorizontalScrollViewTarget(direction, p, contextParameters)
            : calculateVerticalScrollViewTarget(direction, p, contextParameters);

        if (scrollTarget) {
            if (p.getScrollOffsetX() !== scrollTarget.x || p.getScrollOffsetY() !== scrollTarget.y) {
                p.node.current.scrollTo(scrollTarget);
                p.setScrollOffsetX(scrollTarget.x).setScrollOffsetY(scrollTarget.y);
                if (isDebuggerEnabled) {
                    Object.values(focusableMap).forEach((v) => {
                        recalculateLayout(v);
                    });
                } else {
                    recalculateLayout(currentFocusable);
                }
            }
        }
    });
};

const calculateHorizontalScrollViewTarget = (direction: string, scrollView: any, contextParameters: any) => {
    const { currentFocusable }: { currentFocusable: AbstractFocusModel } = contextParameters;
    const { horizontalWindowAlignment }: any = currentFocusable.screen;
    const currentLayout = currentFocusable.getLayout();
    const scrollTarget = { x: scrollView.scrollOffsetX, y: scrollView.scrollOffsetY };

    const isHorizontalBothEdge = horizontalWindowAlignment === WINDOW_ALIGNMENT.BOTH_EDGE;
    const horizontalViewportOffset = currentFocusable.screen?.getHorizontalViewportOffset() ?? DEFAULT_VIEWPORT_OFFSET;
    const verticalViewportOffset = currentFocusable.screen?.getVerticalViewportOffset() ?? DEFAULT_VIEWPORT_OFFSET;

    // This will be executed if we have nested scroll view
    // and jumping between scroll views with buttons UP or DOWN
    if (DIRECTION_VERTICAL.includes(direction)) {
        if (scrollView.scrollOffsetX > currentLayout.xMin) {
            scrollTarget.x = currentLayout.xMin - verticalViewportOffset;
        } else if (scrollView.scrollOffsetX + windowWidth < currentLayout.xMax) {
            scrollTarget.x = isHorizontalBothEdge
                ? currentLayout.xMax - windowWidth + verticalViewportOffset
                : currentLayout.xMin - verticalViewportOffset;
        }
    }

    if (DIRECTION_RIGHT.includes(direction)) {
        if (isHorizontalBothEdge) {
            scrollTarget.x = Math.max(
                currentLayout.xMax - (windowWidth - horizontalViewportOffset),
                scrollView.scrollOffsetX
            );
            if (scrollTarget.x > scrollView.getLayout().innerView.xMax)
                scrollTarget.x = scrollView.getLayout().innerView.xMax;
        } else {
            //Prevent OVERSCROLL
            const targetX = currentLayout.xMin - scrollView.getLayout().xMin - horizontalViewportOffset + windowWidth;
            if (scrollView.getLayout().xMaxScroll >= targetX) {
                scrollTarget.x = currentLayout.xMin - scrollView.getLayout().xMin - horizontalViewportOffset;
            } else {
                scrollTarget.x = scrollView.getLayout().xMaxScroll + horizontalViewportOffset - windowWidth;
            }
        }
    }

    if (DIRECTION_LEFT.includes(direction)) {
        if (isHorizontalBothEdge) {
            scrollTarget.x = Math.min(currentLayout.xMin - horizontalViewportOffset, scrollView.scrollOffsetX);
            if (scrollTarget.x < scrollView.getLayout().innerView.xMin)
                scrollTarget.x = scrollView.getLayout().innerView.xMin;
        } else {
            scrollTarget.x = Math.min(
                currentLayout.xMin - scrollView.getLayout().xMin - horizontalViewportOffset,
                scrollView.scrollOffsetX
            );
        }
    }

    if (scrollTarget.x < 0) scrollTarget.x = 0;
    if (scrollTarget.y < 0) scrollTarget.y = 0;

    return scrollTarget;
};

const calculateVerticalScrollViewTarget = (direction: string, scrollView: any, contextParameters: any) => {
    const { currentFocusable }: { currentFocusable: AbstractFocusModel } = contextParameters;
    const { verticalWindowAlignment }: any = currentFocusable.screen;
    const currentLayout = currentFocusable.getLayout();
    const scrollTarget = { x: scrollView.scrollOffsetX, y: scrollView.scrollOffsetY };

    const isVerticalBothEdge = verticalWindowAlignment === WINDOW_ALIGNMENT.BOTH_EDGE;
    const horizontalViewportOffset = currentFocusable.screen?.getHorizontalViewportOffset() ?? DEFAULT_VIEWPORT_OFFSET;
    const verticalViewportOffset = currentFocusable.screen?.getVerticalViewportOffset() ?? DEFAULT_VIEWPORT_OFFSET;

    // This will be executed if we have nested scroll view
    // and jumping between scroll views with buttons UP or DOWN
    if (DIRECTION_HORIZONTAL.includes(direction)) {
        if (isVerticalBothEdge && currentLayout.absolute.yMax > windowHeight) {
            scrollTarget.y = currentLayout.yMin - scrollView.getLayout().yMin - horizontalViewportOffset;
        } else if (!isVerticalBothEdge) {
            //TODO FIX: OPEN MENU GO BACK TO CONTENT AND DIRECTIONS LOST
            //TODO ignore initial values
            // scrollTarget.y = Math.min(currentLayout.yMin - scrollView.layout.yMin - VIEWPORT_PADDING, scrollView.scrollOffsetY);
        }
    }

    if (DIRECTION_DOWN.includes(direction)) {
        if (isVerticalBothEdge) {
            scrollTarget.y = Math.max(
                currentLayout.yMax - (windowHeight - verticalViewportOffset),
                scrollView.scrollOffsetY
            );
        } else {
            const yMaxScroll =
                scrollView.getLayout().yMaxScroll ||
                scrollView.children[scrollView.children.length - 1].getLayout().yMax;
            const targetY = currentLayout.yMin - scrollView.getLayout().yMin - verticalViewportOffset + windowHeight;

            //Prevent OVERSCROLL
            if (yMaxScroll >= targetY) {
                scrollTarget.y = currentLayout.yMin - scrollView.getLayout().yMin - verticalViewportOffset;
            } else {
                scrollTarget.y = yMaxScroll - windowHeight;
            }
        }
    }

    if (DIRECTION_UP.includes(direction)) {
        const innerViewMin = scrollView.getLayout().innerView.yMin;

        scrollTarget.y = Math.min(currentLayout.yMin - innerViewMin - verticalViewportOffset, scrollView.scrollOffsetY);
    }

    if (scrollTarget.x < 0) scrollTarget.x = 0;
    if (scrollTarget.y < 0) scrollTarget.y = 0;

    return scrollTarget;
};

export { executeScroll };

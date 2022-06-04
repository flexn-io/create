import { Dimensions } from 'react-native';
import AbstractFocusModel from './Model/AbstractFocusModel';
import type { FocusMap } from './types';
import { recalculateLayout } from './layoutManager';
import {
    DIRECTION_VERTICAL,
    DIRECTION_UP,
    DIRECTION_LEFT,
    DIRECTION_RIGHT,
    DEFAULT_VIEWPORT_OFFSET,
} from './constants';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class Scroller {
    public scroll(direction: string, contextParameters: any) {
        const {
            currentFocus,
            focusMap,
            isDebuggerEnabled,
        }: {
            currentFocus: AbstractFocusModel;
            focusMap: FocusMap;
            isDebuggerEnabled: boolean;
        } = contextParameters;

        if (!currentFocus?.getLayout()) {
            //eslint-disable-next-line
            console.warn('Current context were removed during scroll find');
            return;
        }

        const scrollContextParents = this.getParentScrollers(currentFocus);

        scrollContextParents.forEach((p: AbstractFocusModel) => {
            const scrollTarget = p.isHorizontal()
                ? this.calculateHorizontalScrollViewTarget(direction, p, contextParameters)
                : this.calculateVerticalScrollViewTarget(direction, p, contextParameters);

            if (scrollTarget) {
                if (p.getScrollOffsetX() !== scrollTarget.x || p.getScrollOffsetY() !== scrollTarget.y) {
                    p.node.current.scrollTo(scrollTarget);
                    p.setScrollOffsetX(scrollTarget.x).setScrollOffsetY(scrollTarget.y);
                    if (isDebuggerEnabled) {
                        Object.values(focusMap).forEach((v) => {
                            recalculateLayout(v);
                        });
                    } else {
                        recalculateLayout(currentFocus);
                    }
                }
            }
        });
    }

    private getParentScrollers(currentFocus: AbstractFocusModel) {
        const scrollContextParents = [];
        let parent = currentFocus?.getParent();
        // We can only scroll 2 ScrollView at max. one Horz and Vert
        const directionsFilled: any[] = [];
        while (parent) {
            if (parent.isScrollable() && !directionsFilled.includes(parent.isHorizontal())) {
                directionsFilled.push(parent.isHorizontal());
                scrollContextParents.push(parent);
            }
            parent = parent?.getParent();
        }

        return scrollContextParents;
    }

    private calculateHorizontalScrollViewTarget(
        direction: string,
        scrollView: AbstractFocusModel,
        contextParameters: any
    ) {
        const { currentFocus }: { currentFocus: AbstractFocusModel } = contextParameters;
        const currentLayout = currentFocus.getLayout();
        const scrollTarget = { x: scrollView.getScrollOffsetX(), y: scrollView.getScrollOffsetY() };

        const horizontalViewportOffset =
            currentFocus.getScreen()?.getHorizontalViewportOffset() ?? DEFAULT_VIEWPORT_OFFSET;
        const verticalViewportOffset = currentFocus.getScreen()?.getVerticalViewportOffset() ?? DEFAULT_VIEWPORT_OFFSET;

        // This will be executed if we have nested scroll view
        // and jumping between scroll views with buttons UP or DOWN
        if (DIRECTION_VERTICAL.includes(direction)) {
            if (scrollView.getScrollOffsetX() > currentLayout.xMin) {
                scrollTarget.x = currentLayout.xMin - verticalViewportOffset;
            } else if (scrollView.getScrollOffsetX() + windowWidth < currentLayout.xMax) {
                scrollTarget.x = currentLayout.xMin - verticalViewportOffset;
            }
        }

        if (DIRECTION_RIGHT.includes(direction)) {
            //Prevent OVERSCROLL
            const targetX = currentLayout.xMin - scrollView.getLayout().xMin - horizontalViewportOffset + windowWidth;
            if (scrollView.getLayout().xMaxScroll >= targetX) {
                scrollTarget.x = currentLayout.xMin - scrollView.getLayout().xMin - horizontalViewportOffset;
            } else {
                scrollTarget.x = scrollView.getLayout().xMaxScroll + horizontalViewportOffset - windowWidth;
            }
        }

        if (DIRECTION_LEFT.includes(direction)) {
            scrollTarget.x = Math.min(
                currentLayout.xMin - scrollView.getLayout().xMin - horizontalViewportOffset,
                scrollView.getScrollOffsetX()
            );
        }

        if (scrollTarget.x < 0) scrollTarget.x = 0;
        if (scrollTarget.y < 0) scrollTarget.y = 0;

        return scrollTarget;
    }

    private calculateVerticalScrollViewTarget(
        direction: string,
        scrollView: AbstractFocusModel,
        contextParameters: any
    ) {
        const { currentFocus }: { currentFocus: AbstractFocusModel } = contextParameters;
        const currentLayout = currentFocus.getLayout();
        const scrollTarget = { x: scrollView.getScrollOffsetX(), y: scrollView.getScrollOffsetY() };
        const verticalViewportOffset = currentFocus.getScreen()?.getVerticalViewportOffset() ?? DEFAULT_VIEWPORT_OFFSET;

        // This will be executed if we have nested scroll view
        // and jumping between scroll views with buttons UP or DOWN
        //TODO FIX: OPEN MENU GO BACK TO CONTENT AND DIRECTIONS LOST
        //TODO ignore initial values
        // scrollTarget.y = Math.min(currentLayout.yMin - scrollView.layout.yMin - VIEWPORT_PADDING, scrollView.scrollOffsetY);

        const yMaxScroll =
            scrollView.getLayout().yMaxScroll ||
            scrollView.getChildren()[scrollView.getChildren().length - 1].getLayout().yMax;
        const targetY = currentLayout.yMin - scrollView.getLayout().yMin - verticalViewportOffset + windowHeight;

        //Prevent OVERSCROLL
        if (yMaxScroll >= targetY) {
            scrollTarget.y = currentLayout.yMin - scrollView.getLayout().yMin - verticalViewportOffset;
        } else {
            scrollTarget.y = yMaxScroll - windowHeight;
        }

        if (DIRECTION_UP.includes(direction)) {
            const innerViewMin = scrollView.getLayout().innerView.yMin;

            scrollTarget.y = Math.min(
                currentLayout.yMin - innerViewMin - verticalViewportOffset,
                scrollView.getScrollOffsetY()
            );
        }

        if (scrollTarget.x < 0) scrollTarget.x = 0;
        if (scrollTarget.y < 0) scrollTarget.y = 0;

        return scrollTarget;
    }
}

export default new Scroller();

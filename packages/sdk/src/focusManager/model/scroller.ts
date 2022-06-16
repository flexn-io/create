import { Dimensions } from 'react-native';
import AbstractFocusModel from './AbstractFocusModel';
import { recalculateLayout } from '../layoutManager';
import {
    DIRECTION_VERTICAL,
    DIRECTION_UP,
    DIRECTION_LEFT,
    DIRECTION_RIGHT,
    DEFAULT_VIEWPORT_OFFSET,
} from '../constants';
import ScrollView from './scrollview';

const windowWidth = Dimensions.get('window').width;

class Scroller {
    public scroll(direction: string, contextParameters: any) {
        const {
            currentFocus,
        }: {
            currentFocus: AbstractFocusModel;
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
                }
            }
        });
    }

    public scrollTo(cls: AbstractFocusModel, scrollTarget: { x: number; y: number }, direction: string) {
        let parentSW = cls.getParent() as ScrollView;

        if (['up', 'down'].includes(direction) && parentSW.isNested()) {
            parentSW = cls.getParent()?.getParent() as ScrollView;
        }

        if (scrollTarget) {
            if (parentSW.getScrollOffsetX() !== scrollTarget.x || parentSW.getScrollOffsetY() !== scrollTarget.y) {
                parentSW.node.current.scrollTo(scrollTarget);
                parentSW.setScrollOffsetX(scrollTarget.x).setScrollOffsetY(scrollTarget.y);
                recalculateLayout(cls);
            }
        }
    }
    public inlineScroll(direction: string, nextFocus: AbstractFocusModel) {
        const scrollContextParents = this.getParentScrollers(nextFocus);
        const contextParameters = {
            currentFocus: nextFocus,
        };

        scrollContextParents.forEach((p: AbstractFocusModel) => {
            const scrollTarget = p.isHorizontal()
                ? this.calculateHorizontalScrollViewTarget(direction, p, contextParameters)
                : this.calculateVerticalScrollViewTarget(direction, p, contextParameters);

            if (scrollTarget) {
                if (p.getScrollOffsetX() !== scrollTarget.x || p.getScrollOffsetY() !== scrollTarget.y) {
                    p.node.current.scrollTo(scrollTarget);
                    p.setScrollOffsetX(scrollTarget.x).setScrollOffsetY(scrollTarget.y);
                    recalculateLayout(nextFocus);
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
            let xMaxScroll = scrollView.getLayout().xMaxScroll || scrollView.getMostRightChildren().getLayout()?.xMax || 0;
            xMaxScroll += scrollView.getLayout().xMin || 0;

            //Prevent OVERSCROLL
            const targetX = currentLayout.xMin - scrollView.getLayout().xMin - horizontalViewportOffset + windowWidth;
            if (xMaxScroll >= targetX) {
                scrollTarget.x = currentLayout.xMin - scrollView.getLayout().xMin - horizontalViewportOffset;
            } else {
                scrollTarget.x = xMaxScroll + horizontalViewportOffset - windowWidth;
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
        const { scrollContentHeight } = scrollView.getLayout();
        const currentLayout = currentFocus.getLayout();
        const scrollTarget = { x: scrollView.getScrollOffsetX(), y: scrollView.getScrollOffsetY() };
        const verticalViewportOffset = currentFocus.getScreen()?.getVerticalViewportOffset() ?? DEFAULT_VIEWPORT_OFFSET;

        let yMaxScroll = scrollView.getLayout().yMaxScroll || scrollView.getMostBottomChildren().getLayout()?.yMax || 0;
        yMaxScroll += scrollView.getLayout().yMin || 0;

        const targetY = currentLayout.yMin - scrollView.getLayout().yMin - verticalViewportOffset + scrollContentHeight;
        if (DIRECTION_UP.includes(direction)) {
            const innerViewMin = scrollView.getLayout().innerView.yMin;
            scrollTarget.y = Math.min(
                currentLayout.yMin - innerViewMin - verticalViewportOffset - scrollView.getLayout().yMin,
                scrollView.getScrollOffsetY()
            );
        } else {
            if (yMaxScroll >= targetY) {
                scrollTarget.y = currentLayout.yMin - scrollView.getLayout().yMin - verticalViewportOffset;
            } else {
                scrollTarget.y = yMaxScroll - scrollContentHeight;
            }
        }

        if (scrollTarget.x < 0) scrollTarget.x = 0;
        if (scrollTarget.y < 0) scrollTarget.y = 0;

        return scrollTarget;
    }
}

export default new Scroller();

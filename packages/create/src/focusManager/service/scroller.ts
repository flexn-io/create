import { Dimensions } from 'react-native';
import FocusModel from '../model/FocusModel';
import {
    DIRECTION_UP,
    DIRECTION_LEFT,
    DIRECTION_RIGHT,
    DEFAULT_VIEWPORT_OFFSET,
    DIRECTION_DOWN,
    DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL,
} from '../constants';
import ScrollView from '../model/scrollview';

const { width: screenWidth } = Dimensions.get('screen');

class Scroller {
    public calculateAndScrollToTarget(direction: string, contextParameters: any) {
        const {
            currentFocus,
        }: {
            currentFocus: FocusModel;
        } = contextParameters;

        if (!currentFocus?.getLayout()) {
            //eslint-disable-next-line
            console.warn('Current context were removed during scroll find');
            return;
        }

        const scrollContextParents: ScrollView[] = [];
        let parent = currentFocus?.getParent();

        // We can only scroll 2 ScrollView at max. one Horizontally and Vertically
        const directionsFilled: any[] = [];
        while (parent) {
            if (parent.isScrollable() && !directionsFilled.includes((parent as ScrollView).isHorizontal())) {
                directionsFilled.push((parent as ScrollView).isHorizontal());
                scrollContextParents.push(parent as ScrollView);
            }
            parent = parent?.getParent();
        }

        scrollContextParents.forEach((p: ScrollView) => {
            const scrollTarget = this.calculateScrollViewTarget(direction, p, contextParameters);

            if (scrollTarget) {
                if (p.getScrollOffsetX() !== scrollTarget.x || p.getScrollOffsetY() !== scrollTarget.y) {
                    p.node.current.scrollTo(scrollTarget);
                }
            }
        });
    }

    private calculateScrollViewTarget(direction: string, scrollView: ScrollView, contextParameters: any) {
        const { currentFocus }: { currentFocus: FocusModel } = contextParameters;
        const currentLayout = currentFocus.getLayout();
        const horizontalViewportOffset =
            currentFocus.getScreen()?.getHorizontalViewportOffset() ?? DEFAULT_VIEWPORT_OFFSET;
        const verticalViewportOffset = currentFocus.getScreen()?.getVerticalViewportOffset() ?? DEFAULT_VIEWPORT_OFFSET;

        const scrollTarget = {
            x: scrollView.getScrollOffsetX(),
            y: scrollView.getScrollOffsetY(),
        };

        switch (true) {
            case DIRECTION_RIGHT.includes(direction):
                {
                    if (!scrollView.isHorizontal() && currentLayout.yMin < scrollView.getScrollOffsetY()) {
                        scrollTarget.y = currentLayout.yMin - verticalViewportOffset - scrollView.getLayout().yMin;
                    }

                    scrollTarget.x = Math.max(
                        currentLayout.xMin - scrollView.getLayout().xMin - horizontalViewportOffset,
                        scrollView.getScrollOffsetX()
                    );
                }
                break;
            case DIRECTION_LEFT.includes(direction):
                {
                    if (!scrollView.isHorizontal() && currentLayout.yMin < scrollView.getScrollOffsetY()) {
                        scrollTarget.y = currentLayout.yMin - verticalViewportOffset - scrollView.getLayout().yMin;
                    }

                    scrollTarget.x = Math.min(
                        currentLayout.xMin - scrollView.getLayout().xMin - horizontalViewportOffset,
                        scrollView.getScrollOffsetX()
                    );
                }
                break;
            case DIRECTION_UP.includes(direction):
                {
                    scrollTarget.y = Math.min(
                        currentLayout.yMin - verticalViewportOffset - scrollView.getLayout().yMin,
                        scrollView.getScrollOffsetY()
                    );

                    const mathFunc = currentFocus.getLayout().absolute.xMax >= screenWidth ? Math.max : Math.min;
                    scrollTarget.x = mathFunc(
                        currentLayout.xMin - scrollView.getLayout().xMin - horizontalViewportOffset,
                        scrollView.getScrollOffsetX()
                    );
                }
                break;
            case DIRECTION_DOWN.includes(direction):
                {
                    scrollTarget.y = Math.max(
                        currentLayout.yMin - verticalViewportOffset - scrollView.getLayout().yMin,
                        scrollView.getScrollOffsetY()
                    );

                    const mathFunc = currentFocus.getLayout().absolute.xMax >= screenWidth ? Math.max : Math.min;
                    scrollTarget.x = mathFunc(
                        currentLayout.xMin - scrollView.getLayout().xMin - horizontalViewportOffset,
                        scrollView.getScrollOffsetX()
                    );
                }
                break;
            default:
                break;
        }

        if (scrollTarget.x < 0) scrollTarget.x = 0;
        if (scrollTarget.y < 0) scrollTarget.y = 0;

        // If scroll direction is being changed from vertical to horizontal and it's still
        // does not finished scroll action, we wait for vertical scrolling to be completed
        if (scrollView.isScrollingVertically() && DIRECTION_HORIZONTAL.includes(direction)) {
            return null;
        }

        // If scroll target does match new requested scroll target we skip
        // new scroll action and wait for current scroll target to be executed
        if (
            scrollView.getLayout()['scrollTargetY'] === scrollTarget.y &&
            scrollView.getLayout()['scrollTargetX'] === scrollTarget.x &&
            DIRECTION_VERTICAL.includes(direction)
        ) {
            return null;
        }

        scrollView
            .updateLayoutProperty('scrollTargetY', scrollTarget.y)
            .updateLayoutProperty('scrollTargetX', scrollTarget.x);

        return scrollTarget;
    }
}

export default new Scroller();

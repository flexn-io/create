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
import View from '../model/view';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

class Scroller {
    public calculateAndScrollToTarget(
        direction: string,
        contextParameters: {
            currentFocus: View;
            focusMap: Record<string, FocusModel>;
            isDebuggerEnabled: boolean;
        }
    ) {
        const { currentFocus } = contextParameters;

        if (!currentFocus?.getLayout()) {
            //eslint-disable-next-line
            console.warn('Current context were removed during scroll find');
            return;
        }

        const scrollContextParents: ScrollView[] = [];
        let parent = currentFocus?.getParent();

        // We can only scroll 2 ScrollView at max. one Horizontally and Vertically
        const directionsFilled: boolean[] = [];
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

    private calculateScrollViewTarget(
        direction: string,
        scrollView: ScrollView,
        contextParameters: {
            currentFocus: View;
            focusMap: Record<string, FocusModel>;
            isDebuggerEnabled: boolean;
        }
    ) {
        const { currentFocus } = contextParameters;
        const currentLayout = currentFocus.getLayout();
        const horizontalViewportOffset =
            currentFocus.getScreen()?.getHorizontalViewportOffset() ?? DEFAULT_VIEWPORT_OFFSET;
        const verticalViewportOffset = currentFocus.getScreen()?.getVerticalViewportOffset() ?? DEFAULT_VIEWPORT_OFFSET;

        const scrollTarget = {
            x: scrollView.getScrollOffsetX(),
            y: scrollView.getScrollOffsetY(),
        };

        const x = [
            currentLayout.xMin - scrollView.getLayout().xMin - horizontalViewportOffset,
            scrollView.getScrollOffsetX(),
        ];

        const y = [
            currentLayout.yMin - scrollView.getLayout().yMin - verticalViewportOffset,
            scrollView.getScrollOffsetY(),
        ];

        switch (true) {
            case DIRECTION_RIGHT.includes(direction):
                {
                    const mathFunc = currentFocus.getLayout().absolute.yMax >= screenHeight ? Math.max : Math.min;
                    scrollTarget.x = Math.max(...x);
                    scrollTarget.y = mathFunc(...y);
                }
                break;
            case DIRECTION_LEFT.includes(direction):
                {
                    const mathFunc = currentFocus.getLayout().absolute.yMax >= screenHeight ? Math.max : Math.min;
                    scrollTarget.x = Math.min(...x);
                    scrollTarget.y = mathFunc(...y);
                }
                break;
            case DIRECTION_UP.includes(direction):
                {
                    const mathFunc = currentFocus.getLayout().absolute.xMax >= screenWidth ? Math.max : Math.min;
                    // If element is on the top and there is no more elements above which is higher than verticalViewportOffset
                    // then we move whole viewport to the 0 position
                    const lowestFocusableYMin =
                        currentFocus.getScreen()?.getPrecalculatedFocus()?.getLayout()?.yMin || 0;

                    scrollTarget.y = Math.min(
                        y[0] < lowestFocusableYMin && currentLayout.yMax < screenHeight ? 0 : y[0],
                        y[1]
                    );
                    scrollTarget.x = mathFunc(...x);
                }
                break;
            case DIRECTION_DOWN.includes(direction):
                {
                    const mathFunc = currentFocus.getLayout().absolute.xMax >= screenWidth ? Math.max : Math.min;
                    scrollTarget.y = Math.max(...y);
                    scrollTarget.x = mathFunc(...x);
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
            scrollView.getScrollTargetY() === scrollTarget.y &&
            scrollView.getScrollTargetX() === scrollTarget.x &&
            DIRECTION_VERTICAL.includes(direction)
        ) {
            return null;
        }

        scrollView.setScrollTargetY(scrollTarget.y).setScrollTargetX(scrollTarget.x);

        return scrollTarget;
    }
}

export default new Scroller();

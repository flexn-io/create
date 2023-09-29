import { Dimensions } from 'react-native';
import FocusModel, { MODEL_TYPES } from '../model/abstractFocusModel';
import { DIRECTIONS } from '../constants';
import ScrollView from '../model/scrollview';
import View from '../model/view';
import { DEFAULT_VIEWPORT_OFFSET } from '../model/screen';
import { FocusDirection } from '../types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');

class Scroller {
    public calculateAndScrollToTarget(
        direction: FocusDirection,
        longPress: boolean,
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

        while (parent) {
            if (parent.isScrollable()) {
                scrollContextParents.push(parent as ScrollView);
            }
            parent = parent?.getParent();
        }

        scrollContextParents.forEach((p: ScrollView) => {
            const scrollTarget = this.calculateScrollViewTarget(direction, p, longPress, contextParameters);

            if (scrollTarget) {
                if (p.getScrollOffsetX() !== scrollTarget.x || p.getScrollOffsetY() !== scrollTarget.y) {
                    p.node.current.scrollTo(scrollTarget);
                }
            }
        });
    }

    private calculateScrollViewTarget(
        direction: FocusDirection,
        scrollView: ScrollView,
        longPress: boolean,
        contextParameters: {
            currentFocus: View;
            focusMap: Record<string, FocusModel>;
            isDebuggerEnabled: boolean;
        }
    ) {
        const { currentFocus } = contextParameters;
        const currentLayout = currentFocus.getLayout();
        let horizontalViewportOffset =
            currentFocus.getScreen()?.getHorizontalViewportOffset() ?? DEFAULT_VIEWPORT_OFFSET;
        const verticalViewportOffset = currentFocus.getScreen()?.getVerticalViewportOffset() ?? DEFAULT_VIEWPORT_OFFSET;

        // If FlashList has it's own ListHeaderComponent first item should scroll to header width
        if (currentFocus.getParent()?.getType() === MODEL_TYPES.ROW) {
            if (
                currentFocus.getRepeatContext()?.index === 0 &&
                currentFocus.getParent()?.getListHeaderDimensions()?.width
            ) {
                horizontalViewportOffset = currentFocus.getParent()?.getListHeaderDimensions()?.width as number;
            }
        }

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

        switch (direction) {
            case DIRECTIONS.RIGHT:
                {
                    const mathFunc = currentFocus.getLayout().absolute.yMax >= screenHeight ? Math.max : Math.min;
                    scrollTarget.x = Math.max(...x);
                    scrollTarget.y = mathFunc(...y);
                }
                break;
            case DIRECTIONS.LEFT:
                {
                    if (longPress) {
                        // Keep viewport to right side to boost recycling
                        scrollTarget.x =
                            currentLayout.xMin - screenWidth + currentLayout.width + horizontalViewportOffset;
                    } else {
                        const mathFunc = currentFocus.getLayout().absolute.yMax >= screenHeight ? Math.max : Math.min;
                        scrollTarget.x = Math.min(...x);
                        scrollTarget.y = mathFunc(...y);
                    }
                }
                break;
            case DIRECTIONS.UP:
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
            case DIRECTIONS.DOWN:
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
        if (scrollView.isScrollingVertically() && (DIRECTIONS.LEFT === direction || DIRECTIONS.RIGHT === direction)) {
            return null;
        }

        // If scroll target does match new requested scroll target we skip
        // new scroll action and wait for current scroll target to be executed
        if (
            scrollView.getScrollTargetY() === scrollTarget.y &&
            scrollView.getScrollTargetX() === scrollTarget.x &&
            (DIRECTIONS.UP === direction || DIRECTIONS.DOWN === direction)
        ) {
            return null;
        }

        scrollView.setScrollTargetY(scrollTarget.y).setScrollTargetX(scrollTarget.x);

        return scrollTarget;
    }
}

export default new Scroller();

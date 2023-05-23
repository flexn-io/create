import FocusModel from '../model/FocusModel';
import { DIRECTION_UP, DIRECTION_LEFT, DIRECTION_RIGHT, DEFAULT_VIEWPORT_OFFSET, DIRECTION_DOWN } from '../constants';
import ScrollView from '../model/scrollview';
import Recycler from '../model/recycler';

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
                    // console.log(p.node);

                    p.node.current.scrollTo(scrollTarget);
                }
            }
        });
    }

    public scrollToTarget(_cls: FocusModel, _scrollTarget: { x: number; y: number }, _direction: string) {
        // let parentSW = cls.getParent() as ScrollView;
        // if (['up', 'down'].includes(direction) && parentSW.isNested()) {
        //     parentSW = cls.getParent()?.getParent() as ScrollView;
        // }
        // if (scrollTarget) {
        //     if (parentSW.getScrollOffsetX() !== scrollTarget.x || parentSW.getScrollOffsetY() !== scrollTarget.y) {
        //         parentSW.node.current.scrollTo(scrollTarget);
        //         parentSW.setScrollOffsetX(scrollTarget.x).setScrollOffsetY(scrollTarget.y);
        //         recalculateLayout(cls);
        //     }
        // }
    }

    public scrollRecycler(_scrollTarget: { x: number; y: number }, _scroller: Recycler) {
        // if (scrollTarget) {
        //     if (scroller.getScrollOffsetX() !== scrollTarget.x || scroller.getScrollOffsetY() !== scrollTarget.y) {
        //         scroller.node.current.scrollTo(scrollTarget);
        //         scroller.setScrollOffsetX(scrollTarget.x).setScrollOffsetY(scrollTarget.y);
        //         recalculateLayout(scroller);
        //     }
        // }
    }

    private calculateScrollViewTarget(direction: string, scrollView: ScrollView, contextParameters: any) {
        const { currentFocus }: { currentFocus: FocusModel } = contextParameters;
        const currentLayout = currentFocus.getLayout();
        const scrollTarget = { x: scrollView.getScrollOffsetX(), y: scrollView.getScrollOffsetY() };

        const horizontalViewportOffset =
            currentFocus.getScreen()?.getHorizontalViewportOffset() ?? DEFAULT_VIEWPORT_OFFSET;
        const verticalViewportOffset = currentFocus.getScreen()?.getVerticalViewportOffset() ?? DEFAULT_VIEWPORT_OFFSET;

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
                        // console.log(scrollTarget, { direction });
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
                }
                break;
            case DIRECTION_DOWN.includes(direction):
                {
                    scrollTarget.y = Math.max(
                        currentLayout.yMin - verticalViewportOffset - scrollView.getLayout().yMin,
                        scrollView.getScrollOffsetY()
                    );
                }
                break;
            default:
                break;
        }

        if (scrollTarget.x < 0) scrollTarget.x = 0;
        if (scrollTarget.y < 0) scrollTarget.y = 0;

        return scrollTarget;
    }
}

export default new Scroller();

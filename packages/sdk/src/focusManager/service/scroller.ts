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

        const scrollContextParents = this.getParentScrollers(currentFocus);

        scrollContextParents.forEach((p: ScrollView) => {
            const scrollTarget = this.calculateScrollViewTarget(direction, p, contextParameters);

            if (scrollTarget) {
                if (p.getScrollOffsetX() !== scrollTarget.x || p.getScrollOffsetY() !== scrollTarget.y) {
                    p.node.current.scrollTo(scrollTarget);
                }
            }
        });
    }

    public scrollToTarget(cls: FocusModel, scrollTarget: { x: number; y: number }, direction: string) {
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

    public scrollRecycler(scrollTarget: { x: number; y: number }, scroller: Recycler) {
        // if (scrollTarget) {
        //     if (scroller.getScrollOffsetX() !== scrollTarget.x || scroller.getScrollOffsetY() !== scrollTarget.y) {
        //         scroller.node.current.scrollTo(scrollTarget);
        //         scroller.setScrollOffsetX(scrollTarget.x).setScrollOffsetY(scrollTarget.y);
        //         recalculateLayout(scroller);
        //     }
        // }
    }

    private getParentScrollers(currentFocus: FocusModel): ScrollView[] {
        const scrollContextParents: ScrollView[] = [];
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

    private calculateScrollViewTarget(direction: string, scrollView: ScrollView, contextParameters: any) {
        // console.log('IS_NESTED_DIFFERENT_DIRECTION', this.isScrollViewNestedWithDifferentDirection(scrollView));

        const { currentFocus }: { currentFocus: FocusModel } = contextParameters;
        const currentLayout = currentFocus.getLayout();
        const scrollTarget = { x: scrollView.getScrollOffsetX(), y: scrollView.getScrollOffsetY() };

        const horizontalViewportOffset =
            currentFocus.getScreen()?.getHorizontalViewportOffset() ?? DEFAULT_VIEWPORT_OFFSET;
        const verticalViewportOffset = currentFocus.getScreen()?.getVerticalViewportOffset() ?? DEFAULT_VIEWPORT_OFFSET;

        if (DIRECTION_RIGHT.includes(direction)) {
            if (!scrollView.isHorizontal() && currentLayout.yMin < scrollView.getScrollOffsetY()) {
                scrollTarget.y = currentLayout.yMin - verticalViewportOffset - scrollView.getLayout().yMin;
                console.log(scrollTarget, { direction });
            }

            scrollTarget.x = Math.max(
                currentLayout.xMin - scrollView.getLayout().xMin - horizontalViewportOffset,
                scrollView.getScrollOffsetX()
            );
        }

        if (DIRECTION_LEFT.includes(direction)) {
            if (!scrollView.isHorizontal() && currentLayout.yMin < scrollView.getScrollOffsetY()) {
                scrollTarget.y = currentLayout.yMin - verticalViewportOffset - scrollView.getLayout().yMin;
                console.log(scrollTarget, { direction });
            }

            scrollTarget.x = Math.min(
                currentLayout.xMin - scrollView.getLayout().xMin - horizontalViewportOffset,
                scrollView.getScrollOffsetX()
            );
        }

        if (DIRECTION_UP.includes(direction)) {
            scrollTarget.y = Math.min(
                // currentLayout.yMin - innerViewMin - verticalViewportOffset - scrollView.getLayout().yMin,
                currentLayout.yMin - verticalViewportOffset - scrollView.getLayout().yMin,
                scrollView.getScrollOffsetY()
            );
        }

        if (DIRECTION_DOWN.includes(direction)) {
            scrollTarget.y = Math.max(
                currentLayout.yMin - verticalViewportOffset - scrollView.getLayout().yMin,
                scrollView.getScrollOffsetY()
            );
        }

        if (scrollTarget.x < 0) scrollTarget.x = 0;
        if (scrollTarget.y < 0) scrollTarget.y = 0;

        // console.log(scrollView, scrollTarget, { direction });

        return scrollTarget;
    }
}

export default new Scroller();

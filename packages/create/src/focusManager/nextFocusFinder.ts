import { Ratio } from '../helpers';
import { DIRECTIONS } from './constants';
import View from './model/view';
import { ClosestNodeOutput, FocusDirection } from './types';

const OVERLAP_THRESHOLD_PERCENTAGE = 20;
const OVERLAP_NEXT_VALUE = 30;
export const INTERSECTION_MARGIN_VERTICAL = Ratio(200);
export const INTERSECTION_MARGIN_HORIZONTAL = Ratio(50);

const nextOverlapValue = (currentSize: number): number => {
    return (currentSize * OVERLAP_NEXT_VALUE) / 100;
};

const intersects = (
    guideLine: number,
    sizeOfCurrent: number,
    startOfNext: number,
    endOfNext: number,
    intersectionMargin = 0,
    overlapThreshold = OVERLAP_THRESHOLD_PERCENTAGE
) => {
    const a1 = guideLine - sizeOfCurrent * 0.5 - intersectionMargin;
    const a2 = guideLine + sizeOfCurrent * 0.5 + intersectionMargin;

    const c1 = a1 >= startOfNext && a1 <= endOfNext;
    const c2 = a2 >= startOfNext && a2 <= endOfNext;
    const c3 = a1 <= startOfNext && a2 >= endOfNext;

    if (c1) {
        const ixValue = ((endOfNext - a1) * 100) / sizeOfCurrent;
        return ixValue >= overlapThreshold;
    }

    if (c2) {
        const ixValue = ((a2 - startOfNext) * 100) / sizeOfCurrent;
        return ixValue >= overlapThreshold;
    }

    if (c3) return true;

    return false;
};

const euclideanDistance = (current: View, next: View, direction: FocusDirection): number => {
    const currentLayout = current.getLayout().absolute;
    const nextLayout = next.getLayout().absolute;

    let c1, c2, c3, c4, c5;

    if (direction === DIRECTIONS.LEFT || direction === DIRECTIONS.RIGHT) {
        c2 = Math.abs(currentLayout.yMin - nextLayout.yMin);
        c3 = Math.abs(currentLayout.yMax - nextLayout.yMin);
        c4 = Math.abs(currentLayout.yMin - nextLayout.yMax);
        c5 = Math.abs(currentLayout.yMax - nextLayout.yMax);
    } else {
        c2 = Math.abs(currentLayout.xMin - nextLayout.xMin);
        c3 = Math.abs(currentLayout.xMax - nextLayout.xMin);
        c4 = Math.abs(currentLayout.xMin - nextLayout.xMax);
        c5 = Math.abs(currentLayout.xMax - nextLayout.xMax);
    }

    switch (direction) {
        case DIRECTIONS.LEFT:
            c1 = Math.abs(currentLayout.xMin - nextLayout.xMax);
            break;
        case DIRECTIONS.RIGHT:
            c1 = Math.abs(nextLayout.xMin - currentLayout.xMax);
            break;
        case DIRECTIONS.DOWN:
            c1 = Math.abs(nextLayout.yMin - currentLayout.yMax);
            break;
        case DIRECTIONS.UP:
            c1 = Math.abs(currentLayout.yMin - nextLayout.yMax);
            break;
        default:
            c1 = 0;
            break;
    }

    return Math.min(
        Math.sqrt(Math.pow(c1, 2) + Math.pow(c2, 2)),
        Math.sqrt(Math.pow(c1, 2) + Math.pow(c3, 2)),
        Math.sqrt(Math.pow(c1, 2) + Math.pow(c4, 2)),
        Math.sqrt(Math.pow(c1, 2) + Math.pow(c5, 2))
    );
};

const closestDist = (current: View, next: View, direction: FocusDirection): [string, number] => {
    const currentLayout = current.getLayout().absolute;
    const nextLayout = next.getLayout().absolute;

    switch (direction) {
        case DIRECTIONS.UP: {
            if (currentLayout.yMin >= nextLayout.yMax - nextOverlapValue(next.getLayout().height)) {
                const isIntersects = intersects(
                    currentLayout.xCenter,
                    current.getLayout().width,
                    nextLayout.xMin,
                    nextLayout.xMax
                );
                if (isIntersects) {
                    return ['p1', euclideanDistance(current, next, direction)];
                }

                const isIntersectsWithMargins = intersects(
                    currentLayout.xCenter,
                    current.getLayout().width,
                    nextLayout.xMin,
                    nextLayout.xMax,
                    INTERSECTION_MARGIN_VERTICAL,
                    0
                );

                if (isIntersectsWithMargins) {
                    return ['p2', euclideanDistance(current, next, direction)];
                }
            }

            break;
        }
        case DIRECTIONS.DOWN: {
            if (currentLayout.yMin + nextOverlapValue(current.getLayout().height) <= nextLayout.yMin) {
                const isIntersects = intersects(
                    currentLayout.xCenter,
                    current.getLayout().width,
                    nextLayout.xMin,
                    nextLayout.xMax
                );
                if (isIntersects) {
                    return ['p1', euclideanDistance(current, next, direction)];
                }

                const isIntersectsWithMargins = intersects(
                    currentLayout.xCenter,
                    current.getLayout().width,
                    nextLayout.xMin,
                    nextLayout.xMax,
                    INTERSECTION_MARGIN_VERTICAL,
                    0
                );

                if (isIntersectsWithMargins) {
                    return ['p2', euclideanDistance(current, next, direction)];
                }
            }
            break;
        }
        case DIRECTIONS.LEFT: {
            if (currentLayout.xMin >= nextLayout.xMax - nextOverlapValue(next.getLayout().width)) {
                const isIntersects = intersects(
                    currentLayout.yCenter,
                    current.getLayout().height,
                    nextLayout.yMin,
                    nextLayout.yMax
                );
                if (isIntersects) {
                    return ['p1', euclideanDistance(current, next, direction)];
                }

                const isIntersectsWithMargins = intersects(
                    currentLayout.yCenter,
                    current.getLayout().height,
                    nextLayout.yMin,
                    nextLayout.yMax,
                    INTERSECTION_MARGIN_HORIZONTAL,
                    0
                );

                if (isIntersectsWithMargins) {
                    return ['p2', euclideanDistance(current, next, direction)];
                }
            }
            break;
        }
        case DIRECTIONS.RIGHT: {
            if (currentLayout.xMax <= nextLayout.xMin + nextOverlapValue(next.getLayout().width)) {
                const isIntersects = intersects(
                    currentLayout.yCenter,
                    current.getLayout().height,
                    nextLayout.yMin,
                    nextLayout.yMax
                );
                if (isIntersects) {
                    return ['p1', euclideanDistance(current, next, direction)];
                }

                const isIntersectsWithMargins = intersects(
                    currentLayout.yCenter,
                    current.getLayout().height,
                    nextLayout.yMin,
                    nextLayout.yMax,
                    INTERSECTION_MARGIN_HORIZONTAL,
                    0
                );

                if (isIntersectsWithMargins) {
                    return ['p2', euclideanDistance(current, next, direction)];
                }
            }
            break;
        }
        default:
            break;
    }

    return ['', 0];
};

export const distCalc = (
    currentClosestNodeOutput: ClosestNodeOutput,
    direction: FocusDirection,
    current: View,
    next: View
) => {
    const [priority, dist] = closestDist(current, next, direction);
    const output: ClosestNodeOutput = { ...currentClosestNodeOutput };

    switch (priority) {
        case 'p1':
            {
                if (dist !== undefined && currentClosestNodeOutput.match1 >= dist) {
                    output.match1 = dist;
                    output.match1Model = next;
                }
            }
            break;
        case 'p2':
            {
                if (dist !== undefined && currentClosestNodeOutput.match2 >= dist) {
                    output.match2 = dist;
                    output.match2Model = next;
                }
            }
            break;
        default:
            break;
    }

    return output;
};

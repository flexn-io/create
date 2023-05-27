// import { Dimensions } from 'react-native';
// import Logger from './model/logger';
import View from './model/view';
import { ClosestNodeOutput } from './types';

const OVERLAP_THRESHOLD_PERCENTAGE = 20;
const OVERLAP_NEXT_VALUE = 30;
export const INTERSECTION_MARGIN_VERTICAL = 200;
export const INTERSECTION_MARGIN_HORIZONTAL = 50;

const nextOverlapValue = (currentSize: number): number => {
    return (currentSize * OVERLAP_NEXT_VALUE) / 100;
};

const intersects = (guideLine: number, sizeOfCurrent: number, startOfNext: number, endOfNext: number, intersectionMargin = 0, overlapThreshold = OVERLAP_THRESHOLD_PERCENTAGE) => {
    const a1 = (guideLine - sizeOfCurrent * 0.5) - intersectionMargin;
    const a2 = (guideLine + sizeOfCurrent * 0.5) + intersectionMargin;

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

const euclideanDistance = (current: View, next: View, direction: string): number => {
    const currentLayout = current.getLayout().absolute;
    const nextLayout = next.getLayout().absolute;

    let c1, c2, c3, c4, c5;

    if (direction === 'left' || direction === 'right') {
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
        case 'left':
            c1 = Math.abs(currentLayout.xMin - nextLayout.xMax);
            break;
        case 'right':
            c1 = Math.abs(nextLayout.xMin - currentLayout.xMax);
            break;
        case 'down':
            c1 = Math.abs(nextLayout.yMin - currentLayout.yMax);
            break;
        case 'up':
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

const closestDist = (current: View, next: View, direction: string): [string, number] => {
    const currentLayout = current.getLayout().absolute;
    const nextLayout = next.getLayout().absolute;

    switch (direction) {
        case 'up': {
            if (currentLayout.yMin >= nextLayout.yMax - nextOverlapValue(next.getLayout().height)) {
                const isIntersects = intersects(
                    currentLayout.xCenter,
                    current.getLayout().width,
                    nextLayout.xMin,
                    nextLayout.xMax
                );
                if (isIntersects) {
                    return ['p1', euclideanDistance(current, next, 'up')];
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
                    return ['p2', euclideanDistance(current, next, 'up')];
                }
            }

            break;
        }
        case 'down': {
            if (currentLayout.yMin + nextOverlapValue(current.getLayout().height) <= nextLayout.yMin) {
                const isIntersects = intersects(
                    currentLayout.xCenter,
                    current.getLayout().width,
                    nextLayout.xMin,
                    nextLayout.xMax
                );
                if (isIntersects) {
                    return ['p1', euclideanDistance(current, next, 'down')];
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
                    return ['p2', euclideanDistance(current, next, 'down')];
                }
            }
            break;
        }
        case 'left': {
            if (currentLayout.xMin >= nextLayout.xMax - nextOverlapValue(next.getLayout().width)) {
                const isIntersects = intersects(
                    currentLayout.yCenter,
                    current.getLayout().height,
                    nextLayout.yMin,
                    nextLayout.yMax
                );
                if (isIntersects) {
                    return ['p1', euclideanDistance(current, next, 'left')];
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
                    return ['p2', euclideanDistance(current, next, 'left')];
                }
            }
            break;
        }
        case 'right': {
            if (currentLayout.xMax <= nextLayout.xMin + nextOverlapValue(next.getLayout().width)) {
                const isIntersects = intersects(
                    currentLayout.yCenter,
                    current.getLayout().height,
                    nextLayout.yMin,
                    nextLayout.yMax
                );
                if (isIntersects) {
                    return ['p1', euclideanDistance(current, next, 'right')];
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
                    return ['p2', euclideanDistance(current, next, 'right')];
                }
            }
            break;
        }
        default:
            break;
    }

    return ['', 0];
};

export const distCalc = (currentClosestNodeOutput: ClosestNodeOutput, direction: string, current: View, next: View) => {
    const [priority, dist] = closestDist(current, next, direction);

    const output: ClosestNodeOutput = { ...currentClosestNodeOutput };

    // console.log({
    //     priority,
    //     dist,
    //     next: next.getId(),
    // });

    switch (priority) {
        case 'p1':
            {
                if (dist !== undefined && currentClosestNodeOutput.match1 >= dist) {
                    output.match1 = dist;
                    output.match1Model = next;
                    // console.log('FOUND', dist, priority, current.getId(), next.getId());
                }
            }
            break;
        case 'p2':
            {
                if (dist !== undefined && currentClosestNodeOutput.match2 >= dist) {
                    output.match2 = dist;
                    output.match2Model = next;
                    // console.log('FOUND', dist, priority, current.getId(), next.getId());
                }
            }
            break;
        default:
            break;
    }

    return output;
};

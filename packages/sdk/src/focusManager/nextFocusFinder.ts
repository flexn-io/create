// import { Dimensions } from 'react-native';
// import Logger from './model/logger';
import AbstractFocusModel from './model/AbstractFocusModel';

const OVERLAP_THRESHOLD_PERCENTAGE = 10;

const intersects = (guideLine: number, sizeOfCurrent: number, startOfNext: number, endOfNext: number) => {
    const a1 = guideLine - sizeOfCurrent * 0.5;
    const a2 = guideLine + sizeOfCurrent * 0.5;

    const c1 = a1 >= startOfNext && a1 <= endOfNext;
    const c2 = a2 >= startOfNext && a2 <= endOfNext;
    const c3 = a1 <= startOfNext && a2 >= endOfNext;

    if (c1) {
        const ixValue = ((endOfNext - a1) * 100) / sizeOfCurrent;
        return ixValue >= OVERLAP_THRESHOLD_PERCENTAGE;
    }

    if (c2) {
        const ixValue = ((a2 - startOfNext) * 100) / sizeOfCurrent;
        return ixValue >= OVERLAP_THRESHOLD_PERCENTAGE;
    }

    if (c3) return true;

    return false;
};

const closestDist = (current: AbstractFocusModel, next: AbstractFocusModel, direction: string) => {
    const currentLayout = current.getLayout().absolute;
    const nextLayout = next.getLayout().absolute;

    const euclideanDistance = () => {
        const xCenter = Math.abs(currentLayout.xCenter - nextLayout.xCenter);
        const xMin = Math.abs(currentLayout.xMin - nextLayout.xMax);
        const xMax = Math.abs(currentLayout.xMax - nextLayout.xMax);

        const yCenter = Math.abs(currentLayout.yCenter - nextLayout.yCenter);
        const yMin = Math.abs(currentLayout.yMax - nextLayout.yMin);
        const yMax = Math.abs(currentLayout.yMin - nextLayout.yMax);

        const dist = Math.min(
            Math.sqrt(Math.pow(xCenter, 2) + Math.pow(yCenter, 2)),
            Math.sqrt(Math.pow(xMin, 2) + Math.pow(yMin, 2)),
            Math.sqrt(Math.pow(xMax, 2) + Math.pow(yMax, 2))
        );

        return dist;
    };

    switch (direction) {
        case 'up': {
            if (currentLayout.yMin >= nextLayout.yMax - 20) {
                const isIntersects = intersects(
                    currentLayout.xCenter,
                    current.getLayout().width,
                    nextLayout.xMin,
                    nextLayout.xMax
                );
                if (isIntersects) {
                    return ['p1', euclideanDistance()];
                }

                return ['p2', euclideanDistance()];
            }

            break;
        }
        case 'down': {
            if (currentLayout.yMax <= nextLayout.yMin + 20) {
                const isIntersects = intersects(
                    currentLayout.xCenter,
                    current.getLayout().width,
                    nextLayout.xMin,
                    nextLayout.xMax
                );
                if (isIntersects) {
                    return ['p1', euclideanDistance()];
                }

                return ['p2', euclideanDistance()];
            }
            break;
        }
        case 'left': {
            if (currentLayout.xMin >= nextLayout.xMax - 20) {
                const isIntersects = intersects(
                    currentLayout.yCenter,
                    current.getLayout().height,
                    nextLayout.yMin,
                    nextLayout.yMax
                );
                if (isIntersects) {
                    return ['p1', euclideanDistance()];
                }

                return ['p2', euclideanDistance()];
            }
            break;
        }
        case 'right': {
            if (currentLayout.xMax <= nextLayout.xMin + 50) {
                const isIntersects = intersects(
                    currentLayout.yCenter,
                    current.getLayout().height,
                    nextLayout.yMin,
                    nextLayout.yMax
                );
                if (isIntersects) {
                    return ['p1', euclideanDistance()];
                }

                return ['p2', euclideanDistance()];
            } else {
                console.log('NOT CANDIDATE', next.getId(), currentLayout.xMax, nextLayout.xMin);
            }
            break;
        }
        default:
            break;
    }

    return ['', 0];
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
    contextParameters: any,
    current?: any,
    next?: any
) => {
    // const { currentFocus }: { currentFocus: AbstractFocusModel } = contextParameters;

    const [priority, dist] = closestDist(current, next, direction);

    switch (priority) {
        case 'p1':
            {
                if (dist !== undefined && output.match1 >= dist) {
                    output.match1 = dist;
                    output.match1Context = nextCls;
                    console.log('FOUND', dist, priority, current.getId(), next.getId());
                }
            }
            break;
        case 'p2':
            {
                if (dist !== undefined && output.match2 >= dist) {
                    output.match2 = dist;
                    output.match2Context = nextCls;
                    console.log('FOUND', dist, priority, current.getId(), next.getId());
                }
            }
            break;

        default:
            break;
    }
};

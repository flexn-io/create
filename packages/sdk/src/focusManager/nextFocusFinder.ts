import { Dimensions } from 'react-native';
import { DIRECTION_VERTICAL, CUTOFF_SIZE } from './constants';
import Logger from './model/logger';
import AbstractFocusModel from './model/AbstractFocusModel';

const windowWidth = Dimensions.get('window').width;

const intersects = (guideLine: number, sizeOfCurrent: number, startOfNext: number, endOfNext: number) => {
    const a1 = guideLine - sizeOfCurrent * 0.5;
    const a2 = guideLine + sizeOfCurrent * 0.5;

    return (
        (a1 >= startOfNext && a1 <= endOfNext) ||
        (a2 >= startOfNext && a2 <= endOfNext) ||
        (a1 <= startOfNext && a2 >= endOfNext)
    );
};

const nextIsVisible = (nextMax: number, direction: string) => {
    if (DIRECTION_VERTICAL.includes(direction)) {
        return nextMax > 0 && nextMax <= windowWidth;
    }

    return true;
};

const intersectsOffset = (guideLine: number, startOfNext: number, endOfNext: number) =>
    Math.abs(guideLine - Math.round((startOfNext + endOfNext) / 2));

const closestDist = (current: AbstractFocusModel, next: AbstractFocusModel, direction: string) => {
    const priorities = [];
    const currentLayout = current.getLayout();
    const nextLayout = next.getLayout();

    const compareFn = () => {
        const dx = Math.max(
            nextLayout.absolute.xCenter - currentLayout.absolute.xMin,
            0,
            currentLayout.absolute.xMax - nextLayout.absolute.xCenter
        );
        const dy = Math.max(
            nextLayout.absolute.yCenter - currentLayout.absolute.yMin,
            0,
            currentLayout.absolute.yMax - nextLayout.absolute.yCenter
        );
        return Math.sqrt(dx * dx + dy * dy);
    };

    const distY = () => {
        const dy = Math.min(
            Math.abs(currentLayout.absolute.yCenter - nextLayout.absolute.yMax + nextLayout.width),
            Math.abs(currentLayout.absolute.yCenter - nextLayout.absolute.yMax),
        );
        return dy;
        // console.log('dy', dy);
    };


    switch (direction) {
        case 'up': {
            if (currentLayout.yMax >= nextLayout.yMin) {
                const isIntersects = intersects(currentLayout.xCenter, currentLayout.width, nextLayout.xMin, nextLayout.xMax);
                if (isIntersects) {
                    // console.log(distY());
                    return distY();
                }
                console.log('distY', distY());
            }

            break;
        }
        case 'down': {
            if (currentLayout.yMax <= nextLayout.yMin) {
                return compareFn();
            }
            break;
        }
        case 'left': {
            if (currentLayout.xCenter >= nextLayout.xMax) {
                return compareFn();
            }
            break;
        }
        case 'right': {
            if (currentLayout.xMax <= nextLayout.xMin) {
                return compareFn();
            }
            break;
        }
        default:
            break;
    }
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
    next?: any,
) => {
    // const { currentFocus }: { currentFocus: AbstractFocusModel } = contextParameters;
    const ixOffset = intersectsOffset(guideLine, p3, p4);
    const closestDistance = Math.abs(p5 - p6);
    
    
    const closest = closestDist(current, next, direction);
    console.log('closest', closest, current.getId(), next.getId());
    if (closest !== undefined && output.match1 >= closest + ixOffset) {
        output.match1 = closest + ixOffset;
        output.match1Context = nextCls;
        output.match1IxOffset = ixOffset;
        Logger.getInstance().debug('FOUND CLOSER M1', nextCls.getId(), closestDistance);
    }
    
    // const ix3 = intersects(p9, CUTOFF_SIZE, p3, p4);
    // if (
    //     ix3 &&
    //     cornerDistance < 0 &&
    //     output.match3 >= closestDistance &&
    //     output.match3IxOffset >= ixOffset
    // ) {
    //     if (nextCls.getParent()?.getId() !== currentFocus.getParent()?.getId()) {
    //         output.match3 = closestDistance;
    //         output.match3Context = nextCls;
    //         Logger.getInstance().debug('FOUND CLOSER M3', nextCls.getId(), closestDistance);
    //     }
    // }
};

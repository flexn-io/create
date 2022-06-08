import { CUTOFF_SIZE } from './constants';
import Logger from './model/logger';
import AbstractFocusModel from './model/AbstractFocusModel';

const intersects = (guideLine: number, sizeOfCurrent: number, startOfNext: number, endOfNext: number) => {
    const a1 = guideLine - sizeOfCurrent * 0.5;
    const a2 = guideLine + sizeOfCurrent * 0.5;

    return (
        (a1 >= startOfNext && a1 <= endOfNext) ||
        (a2 >= startOfNext && a2 <= endOfNext) ||
        (a1 <= startOfNext && a2 >= endOfNext)
    );
};

const intersectsOffset = (guideLine: number, startOfNext: number, endOfNext: number) =>
    Math.abs(guideLine - Math.round((startOfNext + endOfNext) / 2));

const closestDist = (current: AbstractFocusModel, next: AbstractFocusModel, direction: string) => {
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

    switch (direction) {
        case 'up': {
            if (currentLayout.yMin >= nextLayout.yMax) {
                return compareFn();
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
            if (currentLayout.xMin >= nextLayout.xMax) {
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
    current: AbstractFocusModel,
    next: AbstractFocusModel,
) => {
    const { currentFocus }: { currentFocus: AbstractFocusModel } = contextParameters;
    const ixOffset = intersectsOffset(guideLine, p3, p4);
    const closestDistance = Math.abs(p5 - p6);
    const cornerDistance = p7 - p8;
    
    
    const closest = closestDist(current, next, direction);
    if (closest !== undefined && output.match1 >= closest + ixOffset) {
        output.match1 = closest + ixOffset;
        output.match1Context = nextCls;
        Logger.getInstance().debug('FOUND CLOSER M1', nextCls.getId(), closestDistance);
    }
    
    const ix3 = intersects(p9, CUTOFF_SIZE, p3, p4);
    if (
        ix3 &&
        cornerDistance < 0 &&
        output.match3 >= closestDistance &&
        output.match3IxOffset >= ixOffset
    ) {
        if (nextCls.getParent()?.getId() !== currentFocus.getParent()?.getId()) {
            output.match3 = closestDistance;
            output.match3Context = nextCls;
            Logger.getInstance().debug('FOUND CLOSER M3', nextCls.getId(), closestDistance);
        }
    }
};

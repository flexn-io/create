import { Dimension } from '../../../../index';

interface ResizeDebugHandler {
    resizeDebug(oldDim: Dimension, newDim: Dimension, index: number): void;
}

export default ResizeDebugHandler;

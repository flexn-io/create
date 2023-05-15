import * as React from 'react';
import { CSSProperties } from 'react';
import { Dimension } from '../dependencies/LayoutProvider';

export interface ScrollViewDefaultProps {
    onScroll: (event: ScrollEvent) => void;
    onSizeChanged: (dimensions: Dimension) => void;
    horizontal: boolean;
    canChangeSize: boolean;
    style?: CSSProperties | null;
    useWindowScroll: boolean;
    children?: React.ReactNode;
}
export interface ScrollEvent {
    nativeEvent: {
        contentOffset: {
            x: number;
            y: number;
        };
        layoutMeasurement?: Dimension;
        contentSize?: Dimension;
    };
}
export default abstract class BaseScrollView extends React.Component<ScrollViewDefaultProps, Record<string, unknown>> {
    constructor(props: ScrollViewDefaultProps) {
        super(props);
    }

    public abstract scrollTo(scrollInput: { x: number; y: number; animated: boolean }): void;
}

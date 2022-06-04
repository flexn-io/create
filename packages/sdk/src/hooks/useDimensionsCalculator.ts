import { useState } from 'react';
import { Dimensions } from 'react-native';
import { Ratio } from '../helpers';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

interface Props {
    style: any;
    itemSpacing: number;
    verticalItemSpacing: number;
    horizontalItemSpacing: number;
    itemDimensions: { height: number };
    itemsInViewport: number;
    ref: React.MutableRefObject<any>;
}

export default function useDimensionsCalculator({
    style,
    itemSpacing,
    verticalItemSpacing,
    horizontalItemSpacing,
    itemDimensions,
    itemsInViewport,
    ref,
}: Props) {
    const spacing = Ratio(itemSpacing);
    const verticalSpacing = Ratio(verticalItemSpacing);
    const horizontalSpacing = Ratio(horizontalItemSpacing);

    const [isLoading, setIsLoading] = useState(true);

    const [spacings] = useState(() => {
        return {
            paddingLeft: horizontalSpacing || spacing,
            paddingTop: verticalSpacing || spacing,
            paddingBottom: verticalSpacing || spacing,
            paddingRight: horizontalSpacing || spacing,
        };
    });

    const [boundaries, setBoundaries] = useState(() => {
        let width = style.width || windowWidth;
        const height = style.height || windowHeight;

        if (style.borderWidth) {
            width -= style.borderWidth * 2;
        }
        if (style.marginVertical) {
            width -= style.marginVertical * 2;
        }
        if (style.marginLeft) {
            width -= style.marginLeft;
        }
        if (style.marginRight) {
            width -= style.marginRight;
        }

        return {
            width,
            height,
            relativeHeight: height,
        };
    });

    const calculateRowDimensions = (width: number) => {
        const itemHeight = Ratio(itemDimensions.height);
        const actualWidth = width - itemSpacing; // todo: calculate both sides???

        return {
            layout: { width: actualWidth / itemsInViewport, height: itemHeight + spacing },
            item: { width: actualWidth / itemsInViewport - spacing, height: itemHeight },
        };
    };

    const [rowDimensions, setRowDimensions] = useState(calculateRowDimensions(boundaries.width));

    const onLayout = () => {
        ref.current.measure(
            (_fx: number, _fy: number, _width: number, _height: number, pageX: number, pageY: number) => {
                if (isLoading) {
                    setRowDimensions(calculateRowDimensions(boundaries.width - pageX));
                    setBoundaries((prev) => ({
                        width: prev.width - pageX,
                        relativeHeight: prev.height - pageY,
                        height: prev.height,
                    }));
                    setIsLoading(false);
                }
            }
        );
    };

    return {
        spacings,
        isLoading,
        boundaries,
        rowDimensions,
        onLayout,
    };
}

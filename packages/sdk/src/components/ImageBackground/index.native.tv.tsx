import React from 'react';
import { ImageBackground as RNImageBackgound, ImageBackgroundProps } from 'react-native';
import type { Context } from '../../focusManager/types';

interface ImageBackgroundPropsExtended extends ImageBackgroundProps {
    children?: React.ReactNode;
    parentContext: Context;
}

const ImageBackground = ({ children, parentContext, source, ...props }: ImageBackgroundPropsExtended) => {
    const childrenWithProps = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { parentContext });
        }
        return child;
    });

    return (
        <RNImageBackgound source={source} {...props}>
            {childrenWithProps}
        </RNImageBackgound>
    );
};

ImageBackground.displayName = 'ImageBackground';

export default ImageBackground;

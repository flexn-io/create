import React from 'react';
import { ImageBackground as RNImageBackground, ImageBackgroundProps } from 'react-native';
import type { FocusContext } from '../../focusManager/types';

interface ImageBackgroundPropsExtended extends ImageBackgroundProps {
    children?: React.ReactNode;
    focusContext: FocusContext;
}

const ImageBackground = ({ children, focusContext, source, ...props }: ImageBackgroundPropsExtended) => {
    const childrenWithProps = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, { focusContext });
        }
        return child;
    });

    return (
        <RNImageBackground source={source} {...props}>
            {childrenWithProps}
        </RNImageBackground>
    );
};

ImageBackground.displayName = 'ImageBackground';

export default ImageBackground;

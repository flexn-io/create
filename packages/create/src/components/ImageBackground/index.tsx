import React from 'react';
import { ImageBackground as RNImageBackground, ImageBackgroundProps, Platform } from 'react-native';
import { isSmartTV } from 'react-device-detect';
import type { FocusContext } from '../../focusManager/types';

interface ImageBackgroundPropsExtended extends ImageBackgroundProps {
    children?: React.ReactNode;
    focusContext: FocusContext;
}

const ImageBackground = ({ children, focusContext, source, ...props }: ImageBackgroundPropsExtended) => {
    const isNativeMobile = (Platform.OS === 'android' || Platform.OS === 'ios') && !Platform.isTV;
    // const isWeb = Platform.OS === 'web' && !isSmartTV;

    if (isNativeMobile) {
        return (
            <RNImageBackground {...props} source={source}>
                {children}
            </RNImageBackground>
        );
    }

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

import React from 'react';
import type { ImageProps } from 'react-native';
import { Image as RNImage } from 'react-native';

type RNImageProps = ImageProps & {
    children?: React.ReactNode;
};

const Image = React.forwardRef<RNImage, RNImageProps>((props, ref) => <RNImage {...props} ref={ref} />);

export default Image;

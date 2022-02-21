import React, { ComponentProps } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemedImage from '@theme/ThemedImage';

interface ImageProps extends ComponentProps<'img'> {
    srcDark?: string;
}

export default function Image({ src, srcDark, alt, width, height, className }: ImageProps) {
    const sources = {
        light: useBaseUrl(src),
        dark: useBaseUrl(srcDark || src),
    };

    return <ThemedImage className={className} alt={alt} sources={sources} width={width} height={height} />;
}

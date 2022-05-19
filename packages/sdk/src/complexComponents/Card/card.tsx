import React from 'react';

import Image from '../../components/Image';
import Pressable from '../../components/Pressable';
import StyleSheet from '../../apis/StyleSheet';
import { CardProps } from './types';
import { resolveStyles } from '../../helpers';

const Card = ({ style, src, onFocus, onPress, resizeMode = 'cover', parentContext, repeatContext, focusOptions }: CardProps) => {
    const styles = resolveStyles(style);

    return (
        <Pressable
            style={[baseStyles.card, styles]}
            parentContext={parentContext}
            repeatContext={repeatContext}
            onFocus={onFocus}
            onPress={onPress}
            focusOptions={focusOptions}
        >
            <Image resizeMode={resizeMode} source={src} style={[baseStyles.poster, styles.borderRadius]} />
        </Pressable>
    );
};

const baseStyles = StyleSheet.create({
    card: {
        borderRadius: 5,
        width: 250,
        height: 250,
    },
    poster: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
});

Card.displayName = 'Card';

export default Card;

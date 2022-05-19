import React from 'react';

import Image from '../../components/Image';
import Text from '../../components/Text';
import Pressable from '../../components/Pressable';
import StyleSheet from '../../apis/StyleSheet';
import { CardProps } from './types';
import useStyleFlattener from '../../hooks/useStyleFlattener';

const Card = React.forwardRef<any, CardProps>(
    (
        {
            src,
            title = '',
            resizeMode = 'cover',
            style = {},
            onFocus,
            onPress,
            onBlur,
            parentContext,
            repeatContext,
            focusOptions,
        },
        ref
    ) => {
        const styles = useStyleFlattener(style);

        return (
            <Pressable
                ref={ref}
                style={[baseStyles.card, styles]}
                parentContext={parentContext}
                repeatContext={repeatContext}
                onFocus={onFocus}
                onBlur={onBlur}
                onPress={onPress}
                focusOptions={focusOptions}
            >
                <Image resizeMode={resizeMode} source={src} style={[baseStyles.poster, styles.borderRadius]} />
                <Text style={baseStyles.title} numberOfLines={1}>
                    {title}
                </Text>
            </Pressable>
        );
    }
);

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
    title: {
        fontSize: 26,
        color: 'white',
        textAlign: 'center',
    },
});

Card.displayName = 'Card';

export default Card;

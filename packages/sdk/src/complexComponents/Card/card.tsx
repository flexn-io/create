import React from 'react';

import View from '../../components/View';
import Image from '../../components/Image';
import Text from '../../components/Text';
import Pressable from '../../components/Pressable';
import { CardProps } from './types';
import useStyleFlattener from '../../hooks/useStyleFlattener';
import { Ratio } from '../../helpers';

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
            renderProps,
        },
        ref
    ) => {
        const styles = useStyleFlattener(style, ['width', 'height']);

        const titleStyles = {
            fontSize: styles.fontSize || baseStyles.title.fontSize,
            color: styles.color || baseStyles.title.color,
            textAlign: styles.textAlign || baseStyles.title.textAlign,
        };

        const posterStyles = {
            borderRadius: styles.borderWidth ? 0 : styles.borderRadius,
        };

        const borderProps = {
            borderWidth: styles.borderWidth,
            borderLeftWidth: styles.borderLeftWidth,
            borderRightWidth: styles.borderRightWidth,
            borderTopWidth: styles.borderTopWidth,
            borderBottomWidth: styles.borderBottomWidth,
            borderStartWidth: styles.borderStartWidth,
            borderEndWidth: styles.borderEndWidth,
            borderColor: styles.borderColor,
        };

        const containerStyle = renderProps
            ? [renderProps.style, { width: styles.width, height: styles.height }, borderProps]
            : [baseStyles.card, styles, borderProps];

        delete styles.borderWidth;
        delete styles.borderLeftWidth;
        delete styles.borderRightWidth;
        delete styles.borderTopWidth;
        delete styles.borderBottomWidth;
        delete styles.borderStartWidth;
        delete styles.borderEndWidth;
        delete styles.borderColor;
        delete styles.borderRadius;

        const renderImageWithText = () => (
            <>
                <Image resizeMode={resizeMode} source={src} style={[baseStyles.poster, posterStyles]} />
                <Text style={[baseStyles.title, titleStyles]} numberOfLines={1}>
                    {title}
                </Text>
            </>
        );
        const renderContainerContent = () => {
            if (renderProps) {
                return <View style={[baseStyles.card, styles]}>{renderImageWithText()}</View>;
            }

            return renderImageWithText();
        };

        return (
            <Pressable
                ref={ref}
                style={containerStyle}
                parentContext={parentContext}
                repeatContext={repeatContext}
                onFocus={onFocus}
                onBlur={onBlur}
                onPress={onPress}
                focusOptions={focusOptions}
            >
                {renderContainerContent()}
            </Pressable>
        );
    }
);

const baseStyles = {
    card: {
        width: 250,
        height: 250,
    },
    poster: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: Ratio(26),
        color: '#000000',
        textAlign: 'center',
    },
};

Card.displayName = 'Card';

export default Card;

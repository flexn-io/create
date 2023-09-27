import React from 'react';
import { ImageSourcePropType, StyleSheet } from 'react-native';
import { Image, FocusContext, Pressable } from '@flexn/create';
import { Ratio } from '../utils';

export type Item = {
    thumbSrc: ImageSourcePropType;
    bgSrc: ImageSourcePropType;
    album: string;
    title: string;
};

type Props = {
    focusContext?: FocusContext;
    focusRepeatContext?: {
        focusContext: FocusContext;
        index: number;
    };
    item: Item;
    onFocus: (item: Item) => void;
};

const Item = ({ focusContext, focusRepeatContext, item, onFocus }: Props) => {
    return (
        <Pressable
            style={styles.container}
            focusContext={focusContext}
            focusRepeatContext={focusRepeatContext}
            focusOptions={{
                animator: {
                    type: 'scale_with_border',
                    focus: {
                        borderColor: '#7BB8F9',
                        borderWidth: Ratio(5),
                    },
                },
            }}
            onFocus={() => onFocus(item)}
        >
            <Image source={item.thumbSrc} style={styles.image} />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        width: Ratio(228),
        height: Ratio(228),
        borderWidth: 0,
        borderRadius: Ratio(10),
        marginHorizontal: Ratio(20),
    },
    image: {
        height: '93%',
        width: '93%',
        marginLeft: Ratio(8),
        marginTop: Ratio(8),
        borderRadius: Ratio(6),
    },
});

export default Item;

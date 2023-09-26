import React, { MutableRefObject } from 'react';
import { View, StyleSheet, Text, FocusContext, Image } from '@flexn/create';
import LinearGradient from 'react-native-linear-gradient';
import { Item } from './Item';
import { Ratio } from '../utils';

type Props = {
    focusContext?: FocusContext;
    headerRef: MutableRefObject<any>;
};

export type HeaderHandle = {
    onItemFocused: (item: Item) => void;
    onRowFocused: (rowTitle: string) => void;
};

const Header = ({ focusContext, headerRef }: Props) => {
    const [data, setData] = React.useState<Item | undefined>();
    const [rowTitle, setRowTitle] = React.useState('Listen again');

    React.useImperativeHandle(
        headerRef,
        () => {
            return {
                onItemFocused: (item: Item) => {
                    setData(item);
                },
                onRowFocused: (rowTitle: string) => {
                    setRowTitle(rowTitle);
                },
            };
        },
        []
    );

    return (
        <View style={styles.container} focusContext={focusContext}>
            <Image source={data?.bgSrc} style={styles.image} />
            <LinearGradient colors={['#00000000', '#000000CC', '#000000']} style={styles.linearGradient} />
            <Text style={styles.category}>{rowTitle}</Text>
            <Text style={styles.album}>{data?.album}</Text>
            <Text style={styles.title}>{data?.title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: Ratio(560),
        width: '100%',
    },
    image: {
        height: Ratio(560),
        width: '100%',
    },
    linearGradient: {
        height: Ratio(560),
        width: '100%',
        position: 'absolute',
        top: 0,
    },
    category: {
        fontFamily: 'Inter',
        position: 'absolute',
        fontSize: Ratio(48),
        color: 'white',
        top: Ratio(306),
        left: Ratio(257),
    },
    album: {
        fontFamily: 'Inter',
        position: 'absolute',
        fontSize: Ratio(76),
        fontWeight: '700',
        color: 'white',
        top: Ratio(383),
        left: Ratio(257),
    },
    title: {
        fontFamily: 'Inter',
        position: 'absolute',
        fontSize: Ratio(24),
        color: 'white',
        top: Ratio(488),
        left: Ratio(257),
    },
});

export default Header;

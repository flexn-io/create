import { FlashList, View, Pressable, Image, ScrollView, Text } from '@flexn/create';
import React, { useContext } from 'react';
import { isFactorMobile, isPlatformMacos, isPlatformWeb, isFactorTv } from '@rnv/renative';
import { ThemeContext, ROUTES, Ratio } from '../config';
import { getRandomData, interval, testProps } from '../utils';
import Screen from './screen';

const ScreenCarousels = ({ navigation }: { navigation?: any }) => {
    const { theme } = useContext(ThemeContext);

    const data = [...Array(10).keys()].map((rowNumber) => {
        const itemsInViewport = interval(isFactorMobile ? 1 : 3, isFactorMobile ? 3 : 5);
        return getRandomData(rowNumber, undefined, itemsInViewport);
    });

    const renderItem = ({ item, focusRepeatContext, index }: any) => {
        return (
            <Pressable
                style={styles.cardStyle}
                focusRepeatContext={focusRepeatContext}
                onPress={() => {
                    navigation.navigate(ROUTES.DETAILS, { row: 1, index: index });
                }}
                // animatorOptions={{ type: 'scale_with_border', scale: 1.1 }}
            >
                <Image resizeMode={'cover'} source={{ uri: item.backgroundImage }} style={[styles.poster]} />
                <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                </Text>
            </Pressable>
        );
    };
    return (
        <Screen style={[theme.styles.screen, styles.screen]}>
            <ScrollView {...testProps('template-carousels-screen-container')}>
                {data.map((list, index) => (
                    <View style={styles.listSeparator} key={index}>
                        <FlashList data={list} renderItem={renderItem} type="row" estimatedItemSize={Ratio(200)} />
                    </View>
                ))}
            </ScrollView>
        </Screen>
    );
};

const styles = {
    screen: {
        left: isFactorMobile || isPlatformMacos || isPlatformWeb ? 0 : Ratio(100),
    },
    listSeparator: {
        marginVertical: Ratio(20),
    },
    cardStyle: {
        width: Ratio(300),
        height: Ratio(200),
        borderWidth: isFactorMobile ? 0 : Ratio(5),
        borderRadius: Ratio(5),
        borderColor: isFactorTv ? '#0A74E6' : 'transparent',
        fontSize: isFactorMobile ? 16 : Ratio(26),
    },
    poster: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: Ratio(26),
        color: '#000000',
        // textAlign: 'center',
    },
};

export default ScreenCarousels;

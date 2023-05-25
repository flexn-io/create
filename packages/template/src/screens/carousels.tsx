import { FlashList, View, Pressable, Image, ScrollView, Text } from '@flexn/create';
import React, { useContext } from 'react';
import { isFactorMobile, isPlatformMacos, isPlatformWeb, isFactorTv } from '@rnv/renative';
import { ThemeContext, ROUTES, Ratio } from '../config';
import { generateRandomItemsRow, interval, testProps } from '../utils';
import Screen from './screen';
import { useNavigate } from '../hooks/navigation';

const ScreenCarousels = ({ navigation }: { navigation?: any }) => {
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate({ navigation });

    const data = [...Array(10).keys()].map((rowNumber) => {
        const itemsInViewport = interval(isFactorMobile ? 1 : 3, isFactorMobile ? 3 : 5);
        return generateRandomItemsRow(rowNumber, itemsInViewport);
    });

    const renderItem = ({ item, focusRepeatContext, index }: any) => {
        return (
            <Pressable
                style={styles.cardStyle}
                focusRepeatContext={focusRepeatContext}
                onPress={() => {
                    if (isPlatformWeb) {
                        navigate(ROUTES.DETAILS, { row: 1, index: index });
                    } else {
                        navigation.navigate(ROUTES.DETAILS, { row: 1, index: index });
                    }
                }}
                animatorOptions={{
                    type: 'border',
                    focus: {
                        borderColor: '#0A74E6',
                        borderWidth: Ratio(8),
                    },
                    blur: {
                        borderWidth: 0,
                    },
                }}
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
                        <FlashList
                            data={list}
                            renderItem={renderItem}
                            type="row"
                            estimatedItemSize={Ratio(250)}
                            horizontal
                        />
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
        width: Ratio(250),
        height: Ratio(250),
        borderWidth: isFactorMobile ? 0 : Ratio(5),
        borderRadius: Ratio(5),
        borderColor: 'transparent',
        fontSize: isFactorMobile ? 16 : Ratio(26),
        marginHorizontal: isFactorTv ? 10 : 0,
        marginVertical: isFactorTv ? 15 : 0,
    },
    poster: {
        width: '100%',
        height: isFactorTv ? '80%' : '100%',
    },
    title: {
        fontSize: Ratio(26),
        color: '#000000',
        // textAlign: 'center',
    },
};

export default ScreenCarousels;

import { FlashList, View, Pressable, Image, ScrollView, Text, setFocus } from '@flexn/create';
import React, { useContext, useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { isFactorMobile, isPlatformMacos, isPlatformWeb, isFactorTv } from '@rnv/renative';
import { ThemeContext, ROUTES, Ratio } from '../config';
import { generateRandomItemsRow, interval, testProps } from '../utils';
import Screen from './screen';
import { useWindowDimensions } from 'react-native';
import { useNavigate } from '../hooks/navigation';

const getCarouselSize = () => {
    switch (true) {
        case isFactorTv:
            return {
                width: Ratio(300),
                height: Ratio(300),
            };
        case isFactorMobile:
            return {
                width: 120,
                height: 150,
            };
        default:
            return {
                width: 150,
                height: 150,
            };
    }
};

const ScreenCarousels = ({ navigation }: { navigation?: any }) => {
    const { theme, dark } = useContext(ThemeContext);
    const navigate = useNavigate({ navigation });
    const { height, width } = useWindowDimensions();
    const [data] = useState(() =>
        [...Array(5).keys()].map((rowNumber) => {
            const itemsInViewport = interval(isFactorMobile ? 1 : 3, isFactorMobile ? 3 : 5);
            return generateRandomItemsRow(rowNumber, itemsInViewport, 250, 250);
        })
    );

    React.useEffect(() => {
        setFocus('page');
    }, []);

    const renderItem = ({ item, focusRepeatContext, index }: any) => {
        return (
            <Pressable
                {...testProps(`template-carousels-screen-${index}-packshot`)}
                style={styles.cardStyle}
                focusRepeatContext={focusRepeatContext}
                onPress={() => {
                    if (isPlatformWeb) {
                        navigate(ROUTES.DETAILS, { row: item.rowNumber, index: index });
                    } else {
                        navigation.navigate(ROUTES.DETAILS, { row: item.rowNumber, index: index });
                    }
                }}
                focusOptions={{
                    animator: {
                        type: 'border',
                        focus: {
                            borderColor: '#0A74E6',
                            borderWidth: Ratio(8),
                        },
                    },
                }}
            >
                <Image resizeMode={'cover'} source={{ uri: item.backgroundImage }} style={[styles.poster]} />
                <View style={styles.titleWrapper}>
                    <Text style={[styles.title, { color: dark ? '#FFFFFF' : '#000000' }]} numberOfLines={1}>
                        {item.title}
                    </Text>
                </View>
            </Pressable>
        );
    };

    return (
        <Screen
            style={[theme.styles.screen, styles.screen, { minHeight: height, minWidth: width }]}
            focusOptions={{ nextFocusLeft: 'side-menu', focusKey: 'page' }}
        >
            <ScrollView {...testProps('template-carousels-screen-container')} style={styles.wrapper}>
                {data.map((list, index) => (
                    <View style={styles.listSeparator} key={index}>
                        <FlashList
                            data={list}
                            extraData={{ dark }}
                            renderItem={renderItem}
                            type="row"
                            estimatedItemSize={getCarouselSize().height}
                            horizontal
                            drawDistance={Ratio(Dimensions.get('window').width)}
                            showsHorizontalScrollIndicator={false}
                            style={{ flex: 1 }}
                        />
                    </View>
                ))}
            </ScrollView>
        </Screen>
    );
};

const styles = StyleSheet.create({
    screen: {
        ...(isFactorTv && {
            left: Ratio(100),
            width: Dimensions.get('screen').width - Ratio(100),
        }),
    },
    wrapper: {
        top: Ratio(30),
        marginBottom: isFactorTv ? Ratio(30) : 20,
        height: Dimensions.get('screen').height,
    },
    listSeparator: {
        paddingBottom: isPlatformMacos || isPlatformWeb ? Ratio(20) : Ratio(30),
    },
    cardStyle: {
        ...getCarouselSize(),
        borderWidth: 0,
        borderRadius: Ratio(5),
        borderColor: 'transparent',
        fontSize: isFactorMobile ? 16 : Ratio(26),
        marginHorizontal: isFactorTv ? Ratio(5) : 10,
    },
    poster: {
        width: '100%',
        height: '80%',
    },
    titleWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: isFactorTv ? Ratio(26) : 14,
        width: '90%',
    },
});

export default ScreenCarousels;

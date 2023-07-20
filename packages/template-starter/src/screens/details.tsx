import { TouchableOpacity, ImageBackground, View, Text, ScrollView, ActivityIndicator } from '@flexn/create';
import React, { useContext, useState, useEffect } from 'react';
import { getScaledValue, isPlatformWeb } from '@rnv/renative';
import { ThemeContext, ROUTES } from '../config';
import { usePop, useReplace } from '../hooks';
import { DataItem, getRandomItem, testProps } from '../utils';
import Screen from './screen';
import { useWindowDimensions } from 'react-native';

const ScreenDetails = ({ route, navigation, router }: { navigation?: any; router?: any; route?: any }) => {
    const { height } = useWindowDimensions();
    const replace = useReplace({ navigation });
    const pop = usePop({ navigation });
    const [item, setItem] = useState<DataItem>();
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        const params = isPlatformWeb ? router.query : route?.params;
        if (params) {
            setItem(getRandomItem(params.row, params.index));
        }
    }, []);

    if (!item) {
        return (
            <View style={theme.styles.center}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <Screen style={[theme.styles.screen, { minHeight: height }]} focusOptions={{ focusKey: 'page' }}>
            <ImageBackground source={{ uri: item.backgroundImage }} style={{ flex: 1 }} resizeMode="cover">
                <ScrollView contentContainerStyle={theme.styles.center}>
                    <View style={theme.styles.detailsInfoContainer}>
                        <Text style={theme.styles.detailsTitle} {...testProps('template-details-screen-cat-name-text')}>
                            {item.title}
                        </Text>
                    </View>
                    <TouchableOpacity
                        {...testProps('template-details-screen-go-back-button')}
                        style={theme.styles.button}
                        onPress={() => pop()}
                        focusOptions={{
                            forbiddenFocusDirections: ['up'],
                            animator: {
                                type: 'border',
                                focus: { borderColor: '#0A74E6', borderWidth: getScaledValue(2) },
                                // blur: { borderColor: '#FFFFFF', borderWidth: getScaledValue(2) },
                            },
                        }}
                    >
                        <Text style={[theme.styles.buttonText, { color: '#FFFFFF' }]}>Go back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        {...testProps('template-details-screen-go-to-home-button')}
                        style={theme.styles.button}
                        onPress={() => replace(ROUTES.HOME)}
                        focusOptions={{
                            forbiddenFocusDirections: ['down'],
                            animator: {
                                type: 'border',
                                focus: { borderColor: '#0A74E6', borderWidth: getScaledValue(2) },
                                // blur: { borderColor: '#FFFFFF', borderWidth: getScaledValue(2) },
                            },
                        }}
                    >
                        <Text style={[theme.styles.buttonText, { color: '#FFFFFF' }]}>Go to home</Text>
                    </TouchableOpacity>
                </ScrollView>
            </ImageBackground>
        </Screen>
    );
};

export default ScreenDetails;

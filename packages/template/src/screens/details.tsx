import {
    TouchableOpacity,
    ImageBackground,
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    ANIMATION_TYPES,
} from '@flexn/create';
import React, { useContext, useState, useEffect } from 'react';
import { getScaledValue, isPlatformWeb } from '@rnv/renative';
import { ThemeContext, ROUTES } from '../config';
import { usePop, useReplace } from '../hooks';
import { DataItem, getRandomItem } from '../utils';
import Screen from './screen';

const ScreenDetails = ({ route, navigation, router }: { navigation?: any; router?: any; route?: any }) => {
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
        <Screen style={[theme.styles.screen]}>
            <ImageBackground source={{ uri: item.backgroundImage }} style={{ flex: 1 }} resizeMode="cover">
                <ScrollView contentContainerStyle={theme.styles.center}>
                    <View style={theme.styles.detailsInfoContainer}>
                        <Text style={theme.styles.detailsTitle}>{item.title}</Text>
                    </View>
                    <TouchableOpacity
                        style={theme.styles.button}
                        onPress={() => pop()}
                        focusOptions={{
                            forbiddenFocusDirections: ['up'],
                            animatorOptions: {
                                type: ANIMATION_TYPES.BORDER,
                                focus: { borderColor: '#0A74E6', borderWidth: getScaledValue(2) },
                                blur: { borderColor: '#FFFFFF', borderWidth: getScaledValue(2) },
                            },
                        }}
                    >
                        <Text style={[theme.styles.buttonText, { color: '#FFFFFF' }]}>Go back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={theme.styles.button}
                        onPress={() => replace(ROUTES.HOME)}
                        focusOptions={{
                            forbiddenFocusDirections: ['down'],
                            animatorOptions: {
                                type: ANIMATION_TYPES.BORDER,
                                focus: { borderColor: '#0A74E6', borderWidth: getScaledValue(2) },
                                blur: { borderColor: '#FFFFFF', borderWidth: getScaledValue(2) },
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

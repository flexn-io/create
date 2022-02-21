import { ScrollView, Text, View } from '@flexn/sdk';
import React from 'react';
import { isPlatformWeb, useNavigate } from 'renative';
import { Button } from '../../../../components/Button';
import Screen from '../../../../components/Screen';
import { themeStyles } from '../../../../config';
import { testProps } from '../../../../utils';
import { ROWS_COUNT } from './config';

const Rows = (props) => {
    const navigate = useNavigate(props);

    let scrollRef;
    let handleFocus;
    let handleUp;

    const handleOnPress = (amount) => {
        const route = isPlatformWeb ? '/RowsScreen' : 'RowsScreen';
        navigate(route, {}, { state: { amount } });
    };

    return (
        <Screen style={[themeStyles.screen]}>
            <Text style={[themeStyles.textH2]}>Performance Test 1 (Rows)</Text>
            <ScrollView ref={scrollRef} contentContainerStyle={themeStyles.container}>
                <View
                    style={{
                        width: '80%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 15,
                    }}
                >
                    {ROWS_COUNT.map((amount, index) => (
                        <Button
                            key={amount}
                            style={[themeStyles.button, { borderColor: 'lightcoral' }]}
                            textStyle={[themeStyles.buttonText, { color: 'lightcoral' }]}
                            title={`${amount} rows`}
                            onPress={() => handleOnPress(amount)}
                            onEnterPress={() => handleOnPress(amount)}
                            onBecameFocused={handleFocus}
                            onArrowPress={index === 0 && handleUp}
                            {...testProps(`flexn-screens-focus-performance-rows-button-${index}-rows-amount-${amount}`)}
                        />
                    ))}
                </View>
            </ScrollView>
        </Screen>
    );
};

export default Rows;

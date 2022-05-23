import { List } from '@flexn/sdk';
import React, { useContext } from 'react';
import { isFactorMobile } from '@rnv/renative';
import { ThemeContext, ROUTES, Ratio } from '../config';
import { getRandomData, interval } from '../utils';
import Screen from './screen';

const ScreenCarousels = ({ navigation }: { navigation?: any }) => {
    const { theme } = useContext(ThemeContext);

    const data = [...Array(10).keys()].map((rowNumber) => {
        return {
            items: getRandomData(rowNumber, undefined),
            itemsInViewport: interval(3, 5),
        };
    });

    return (
        <Screen style={[theme.styles.screen, styles.screen]}>
            <List
                items={data}
                itemDimensions={{ height: 250 }}
                rowHeight={400}
                animatorOptions={{ type: 'scale_with_border', scale: 1.1 }}
                focusOptions={{ forbiddenFocusDirections: ['right'] }}
                itemSpacing={30}
                cardStyle={styles.cardStyle}
                onPress={(data) => {
                    navigation.navigate(ROUTES.DETAILS, { row: data.rowNumber, index: data.index });
                }}
            />
        </Screen>
    );
};

const styles = {
    screen: {
        left: Ratio(100),
    },
    cardStyle: {
        borderWidth: isFactorMobile ? 0 : 5,
        borderRadius: 5,
        borderColor: '#0A74E6',
    },
};

export default ScreenCarousels;

import {
    Image,
    TouchableOpacity,
    RecyclableList,
    RecyclableListDataProvider,
    RecyclableListLayoutProvider,
    View,
    ScrollView,
    Text,
} from '@flexn/sdk';
import { testProps } from '../utils';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { isFactorMobile } from 'renative';
import { Ratio, ThemeContext, ROUTES } from '../config';
import { useNavigate } from '../hooks';
import { getRandomData } from '../utils';
import Screen from './screen';

const { width } = Dimensions.get('window');
const MARGIN_GUTTER = Ratio(20);

const itemsInRows = [
    [1, 3],
    [2, 4],
    [3, 5],
    [4, 6],
    [2, 4],
    [3, 5],
];

function getRecyclerDimensions(itemsInViewport: number) {
    return {
        layout: { width: width / itemsInViewport, height: Ratio(270) },
        item: { width: width / itemsInViewport - MARGIN_GUTTER, height: Ratio(250) },
    };
}

const RecyclerExample = ({ items, rowNumber, dimensions: { layout, item }, parentContext, navigation }: any) => {
    const navigate = useNavigate({ navigation });
    const { theme } = useContext(ThemeContext);

    const [dataProvider] = useState(
        new RecyclableListDataProvider((r1: number, r2: number) => r1 !== r2).cloneWithRows(items)
    );

    const layoutProvider = useRef(
        new RecyclableListLayoutProvider(
            () => '_',
            (_: string | number, dim: { width: number; height: number }) => {
                dim.width = layout.width;
                dim.height = layout.height;
            }
        )
    ).current;

    return (
        <View parentContext={parentContext} style={theme.styles.recyclerContainer}>
            <RecyclableList
                dataProvider={dataProvider}
                layoutProvider={layoutProvider}
                rowRenderer={(_type: string | number, data: any, index: number, repeatContext: any) => {
                    return (
                        <TouchableOpacity
                            style={[theme.styles.recyclerItem, { width: item.width, height: item.height }]}
                            repeatContext={repeatContext}
                            onPress={() => {
                                navigate(ROUTES.DETAILS, { row: rowNumber, index: data.index });
                            }}
                            {...testProps(`template-my-page-image-pressable-${index}`)}
                        >
                            <Image source={{ uri: data.backgroundImage }} style={{ width: '100%', height: '80%' }} />
                            <Text style={theme.styles.recyclerItemText} numberOfLines={1}>
                                {data.title}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
                isHorizontal
                style={theme.styles.recycler}
                contentContainerStyle={theme.styles.recyclerContent}
                scrollViewProps={{
                    showsHorizontalScrollIndicator: false,
                }}
                focusOptions={{
                    forbiddenFocusDirections: ['right'],
                }}
            />
        </View>
    );
};

const ScreenCarousels = ({ navigation }: { navigation?: any }) => {
    const { theme } = useContext(ThemeContext);
    const [recyclers, setRecyclers] = useState<
        {
            items: any;
            dimensions: {
                layout: {
                    width: number;
                    height: number;
                };
                item: {
                    width: number;
                    height: number;
                };
            };
        }[]
    >([]);

    useEffect(() => {
        setRecyclers(
            itemsInRows.map(([smallScreenItems, bigScreenItems], rowNumber) => ({
                dimensions: getRecyclerDimensions(isFactorMobile ? smallScreenItems : bigScreenItems),
                items: getRandomData(rowNumber),
            }))
        );
    }, []);

    const renderRecyclers = () =>
        recyclers.map((recyclerInfo, i) => (
            <RecyclerExample key={i} rowNumber={i} navigation={navigation} {...recyclerInfo} />
        ));

    return (
        <Screen style={theme.styles.screen}>
            <ScrollView>{renderRecyclers()}</ScrollView>
        </Screen>
    );
};

export default ScreenCarousels;

import React, { useState } from 'react';
import { StyleSheet, useWindowDimensions, Dimensions } from 'react-native';
import {
    View,
    FlashList,
    Pressable,
    Image,
    CreateListRenderItemInfo,
    ScrollView,
    withParentContextMapper,
    Animated,
} from '@flexn/create';
import Screen from './screen';
import { Ratio } from '../utils';
import { Button } from '../components/Button';
import { getScaledValue } from '@rnv/renative';

// const border = {
//     type: 'border',
//     focus: {
//         borderWidth: 5,
//         borderColor: 'yellow',
//     },
//     blur: {
//         borderWidth: 4,
//         borderColor: '#FFFFFF',
//     },
// };

// const scale = {
//     type: 'scale',
//     focus: {
//         scale: 1.2,
//     },
// };

const AnimatedScrollView = withParentContextMapper(Animated.ScrollView);
const AnimatedView = Animated.createAnimatedComponent(View);

const { height } = Dimensions.get('screen');

const kittyNames = ['Abby', 'Angel', 'Annie', 'Baby', 'Bailey', 'Bandit'];

function interval(min = 0, max = kittyNames.length - 1) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateData(width: number, height: number, items = 30) {
    const temp: any = [];
    for (let index = 0; index < items; index++) {
        temp.push({
            index,
            backgroundImage: `https://placekitten.com/${width}/${height}`,
            title: `${kittyNames[interval()]} ${kittyNames[interval()]} ${kittyNames[interval()]}`,
        });
    }

    return temp;
}

const ComplexTabs = () => {
    const { height } = useWindowDimensions();
    const [data, setData] = useState([]);
    const scrollA = React.useRef(new Animated.Value(0)).current;

    const rowRenderer = ({ item, focusRepeatContext }: CreateListRenderItemInfo<any>) => {
        return (
            <Pressable
                style={styles.packshot}
                focusRepeatContext={focusRepeatContext}
                focusOptions={{
                    animator: {
                        type: 'scale',
                        focus: {
                            scale: 1.2,
                        },
                    },
                }}
            >
                <Image source={{ uri: item.backgroundImage }} style={styles.image} />
            </Pressable>
        );
    };

    React.useEffect(() => {
        setTimeout(() => {
            setData(generateData(230, 230, 30));
        }, 3000);
    }, []);

    const TAB_HEIGHT = Ratio(600);
    return (
        <Screen style={{ backgroundColor: '#222222' }}>
            <ScrollView>
                <View>
                    <AnimatedScrollView
                        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollA } } }], {
                            useNativeDriver: true,
                        })}
                        scrollEventThrottle={1}
                    >
                        <View
                            style={{
                                // marginTop: -getRealHeight(deviceContext),
                                // paddingTop: getRealHeight(deviceContext),
                                // alignItems: 'center',
                                // overflow: 'hidden',
                                width: '100%',
                                // height: TAB_HEIGHT,
                                borderColor: 'yellow',
                                borderWidth: 1,
                            }}
                        >
                            <AnimatedView
                                style={{
                                    marginLeft: 50,
                                    height: TAB_HEIGHT,
                                    transform: [
                                        {
                                            translateY: scrollA.interpolate({
                                                inputRange: [-TAB_HEIGHT, 0, TAB_HEIGHT, TAB_HEIGHT + 1],
                                                outputRange: [-TAB_HEIGHT / 2, 0, TAB_HEIGHT * 0.25, TAB_HEIGHT * 0.25],
                                            }),
                                        },
                                    ],
                                }}
                            >
                                {/* <Button
                                    title="Random button"
                                    style={{ ...styles.button, position: 'absolute' }}
                                    textStyle={{ color: 'white', fontSize: Ratio(26) }}
                                /> */}
                            </AnimatedView>
                        </View>
                        <View>
                            <View style={{ flex: 1 }}>
                                <View
                                    style={{
                                        borderWidth: 1,
                                        borderColor: 'white',
                                        flexDirection: 'row',
                                        // justifyContent: 'center',
                                        alignItems: 'center',
                                        height: Ratio(150),
                                        marginTop: Ratio(450),
                                        // position: 'absolute',
                                        // top: 0,
                                    }}
                                >
                                    <Button
                                        title="Tab1"
                                        style={styles.button}
                                        textStyle={{ color: 'white', fontSize: Ratio(26) }}
                                        // onPress={() => onPress(0)}
                                    />
                                    <Button
                                        title="Tab2"
                                        style={styles.button}
                                        textStyle={{ color: 'white', fontSize: Ratio(26) }}
                                        // onPress={() => onPress(1)}
                                    />
                                </View>
                                <View style={{ top: Ratio(20), height: height - 150 }}>
                                    {data.length !== 0 && (
                                        <View
                                            style={{
                                                flex: 1,
                                                width: '100%',
                                            }}
                                        >
                                            <FlashList
                                                // key={data.length}
                                                data={data}
                                                renderItem={rowRenderer}
                                                horizontal={false}
                                                numColumns={3}
                                                type="grid"
                                                // estimatedItemSize={Ratio(200)}
                                                style={{ flex: 1 }}
                                            />
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    </AnimatedScrollView>
                </View>
            </ScrollView>
        </Screen>
    );
};

const styles = StyleSheet.create({
    button: {
        marginHorizontal: getScaledValue(20),
        borderWidth: getScaledValue(2),
        borderRadius: getScaledValue(25),
        borderColor: '#62DBFB',
        height: getScaledValue(50),
        width: Ratio(500),
    },
    tabs: {
        // width: '100%',
        // height: Ratio(600),
        // borderColor: 'yellow',
        // borderWidth: 1,
    },
    packshot: {
        width: Ratio(height / 3),
        height: Ratio(height / 3),
        // borderColor: 'red',
        // borderWidth: 1,
        marginHorizontal: 5,
        // marginVertical: Ratio(50),
        // borderWidth: 2,
        // top: 100,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default ComplexTabs;

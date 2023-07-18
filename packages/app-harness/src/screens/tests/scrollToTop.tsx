import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ScrollView, View, Pressable, Image, CreateListRenderItemInfo, FlashList } from '@flexn/create';
import { getScaledValue } from '@rnv/renative';
import Screen from './../screen';
import { Button } from '../../components/Button';
import { Ratio } from '../../utils';

const border = {
    type: 'border',
    focus: {
        borderWidth: 5,
        borderColor: 'yellow',
    },
};

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

const ScrollToTop = () => {
    const [data] = React.useState(generateData(200, 200, 12));
    const [scrollViewData] = React.useState(generateData(200, 200, 30));

    const rowRenderer = ({ item, focusRepeatContext }: CreateListRenderItemInfo<any>) => {
        return (
            <Pressable
                style={styles.packshot}
                focusRepeatContext={focusRepeatContext}
                focusOptions={{
                    animator: {
                        type: 'border',
                        focus: {
                            borderColor: '#FF0000',
                            borderWidth: 2,
                        },
                    },
                }}
            >
                <Image source={{ uri: item.backgroundImage }} style={styles.image} />
            </Pressable>
        );
    };

    return (
        <Screen style={{ backgroundColor: '#222222' }} focusOptions={{ verticalViewportOffset: Ratio(100) }}>
            <ScrollView>
                <View style={{ borderColor: 'red', borderWidth: 3 }}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>
                        If you see me while moving up test works
                    </Text>
                </View>
                <View style={{ marginTop: Ratio(20), flexDirection: 'row' }}>
                    <View>
                        <Button
                            style={{ ...styles.button, ...styles.button1 }}
                            title="Button1"
                            textStyle={styles.buttonTextStyle}
                            focusOptions={{ animatorOptions: border }}
                        />
                        <Button
                            style={{ ...styles.button, ...styles.button2 }}
                            title="Button2"
                            textStyle={styles.buttonTextStyle}
                            focusOptions={{ animatorOptions: border }}
                        />
                        <Button
                            style={{ ...styles.button, ...styles.button3 }}
                            title="Button3"
                            textStyle={styles.buttonTextStyle}
                            focusOptions={{ animatorOptions: border }}
                        />
                        <Button
                            style={{ ...styles.button, ...styles.button4 }}
                            title="Button4"
                            textStyle={styles.buttonTextStyle}
                            focusOptions={{ animatorOptions: border }}
                        />
                        <Button
                            style={{ ...styles.button, ...styles.button5 }}
                            title="Button5"
                            textStyle={styles.buttonTextStyle}
                            focusOptions={{ animatorOptions: border, forbiddenFocusDirections: ['down'] }}
                        />
                    </View>
                    <View>
                        {scrollViewData.map((_: any, index: number) => (
                            <Button
                                key={index}
                                style={{
                                    ...styles.button,
                                    marginTop: Ratio(index === 0 ? 250 : 20),
                                    height: Ratio(50),
                                }}
                                title={`Button${index + 1}`}
                                textStyle={styles.buttonTextStyle}
                                focusOptions={{ animatorOptions: border }}
                            />
                        ))}
                    </View>
                    <View style={{ flex: 1, marginTop: Ratio(240), left: Ratio(50) }}>
                        <FlashList
                            data={data}
                            renderItem={rowRenderer}
                            horizontal={false}
                            type="row"
                            estimatedItemSize={Ratio(150)}
                            style={{ flex: 1 }}
                            focusOptions={{ forbiddenFocusDirections: ['down'] }}
                        />
                    </View>
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
        marginTop: Ratio(100),
    },
    packshot: {
        width: Ratio(150),
        height: Ratio(150),
        // borderColor: 'red',
        // borderWidth: 1,
        margin: 5,
        borderWidth: 4,
        borderColor: 'grey',
        // borderWidth: 2,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    buttonTextStyle: {
        color: '#ffffff',
        fontSize: Ratio(20),
    },
    button1: {
        marginTop: Ratio(250),
    },
    button2: {
        marginTop: Ratio(250),
    },
    button3: {
        marginTop: Ratio(250),
    },
    button4: {
        marginTop: Ratio(250),
    },
    button5: {
        marginTop: Ratio(250),
    },
    button6: {},
    button7: {},
    button8: {},
    button9: {},
    button10: {},
});

export default ScrollToTop;

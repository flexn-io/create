import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { ScrollView, View, FlashList, Pressable, Image, CreateListRenderItemInfo } from '@flexn/create';
import { getScaledValue } from '@rnv/renative';
import Screen from './../screen';
import { Button } from '../../components/Button';
import { Ratio } from '../../utils';

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
            backgroundImage: `https://picsum.photos/${width + index}/${height}`,
            title: `${kittyNames[interval()]} ${kittyNames[interval()]} ${kittyNames[interval()]}`,
        });
    }

    return temp;
}

const DirectionalFocus = () => {
    const [data] = React.useState(generateData(200, 200, 200));

    const rowRenderer = ({ item, focusRepeatContext }: CreateListRenderItemInfo<any>) => {
        return (
            <Pressable
                style={styles.packshot}
                focusRepeatContext={focusRepeatContext}
                focusOptions={{
                    animator: {
                        type: 'border',
                        focus: {
                            borderWidth: 5,
                            borderColor: 'yellow',
                        },
                    },
                }}
            >
                <Image source={{ uri: item.backgroundImage }} style={styles.image} />
            </Pressable>
        );
    };

    return (
        <Screen style={{ backgroundColor: '#222222' }}>
            <ScrollView>
                <View style={{ top: Ratio(20), height }}>
                    <Button
                        style={{ ...styles.button, ...styles.button1 }}
                        title="Button1: -> Button2"
                        textStyle={styles.buttonTextStyle}
                    />
                    <Button
                        style={{ ...styles.button, ...styles.button2 }}
                        title="Button2: -> Button3"
                        textStyle={styles.buttonTextStyle}
                    />
                    <Button
                        style={{ ...styles.button, ...styles.button3 }}
                        title="Button3: -> Button4"
                        textStyle={styles.buttonTextStyle}
                    />
                    <Button
                        style={{ ...styles.button, ...styles.button4 }}
                        title="Button4: -> Button5"
                        textStyle={styles.buttonTextStyle}
                    />
                    <FlashList
                        data={data}
                        renderItem={rowRenderer}
                        horizontal
                        type="row"
                        estimatedItemSize={Ratio(150)}
                        style={{ flex: 1, top: Ratio(200) }}
                    />
                    {/* <Button
                        style={{ ...styles.button, ...styles.button5 }}
                        title="Button5: -> Button6"
                        textStyle={styles.buttonTextStyle}
                    /> */}
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
        marginTop: getScaledValue(20),
    },
    packshot: {
        width: Ratio(150),
        height: Ratio(150),
        // borderColor: 'red',
        // borderWidth: 1,
        margin: 5,
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
    button1: {},
    button2: {
        left: Ratio(400),
    },
    button3: {
        left: Ratio(1000),
    },
    button4: {
        top: Ratio(100),
        left: Ratio(250),
    },
    button5: {
        top: Ratio(300),
        left: Ratio(500),
    },
    button6: {},
    button7: {},
    button8: {},
    button9: {},
    button10: {},
});

export default DirectionalFocus;

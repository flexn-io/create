import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import {
    ScrollView,
    View,
    RecyclableList,
    RecyclableListDataProvider,
    RecyclableListLayoutProvider,
    Pressable,
    Image,
} from '@flexn/sdk';
import { getScaledValue } from '@rnv/renative';
import Screen from './screen';
import { Button } from '../components/Button';
import { generateData, Ratio } from '../utils';

const DynamicState = () => {
    const [button1Visible, setButton1Visible] = useState(true);
    const [button2, setButton2] = useState({ marginTop: 100 });

    const layoutProvider: any = useRef();
    const dataProviderInstance = useRef(new RecyclableListDataProvider((r1, r2) => r1 !== r2)).current;
    const [dataProvider, setDataProvider] = useState(dataProviderInstance.cloneWithRows(generateData(100, 100, 100)));

    layoutProvider.current = new RecyclableListLayoutProvider(
        () => '_',
        (_: string | number, dim: { width: number; height: number }) => {
            dim.width = 100;
            dim.height = 100;
        }
    );

    const rowRenderer = (_type: string | number, item: any, index: number, repeatContext: any) => {
        return (
            <Pressable style={styles.packshot} repeatContext={repeatContext}>
                <Image source={{ uri: item.backgroundImage }} style={styles.image} />
            </Pressable>
        );
    };

    useEffect(() => {
        setTimeout(() => {
            // setButton1Visible(false);
            setButton2({ marginTop: 300 });
        }, 3000);
    }, []);

    return (
        <Screen style={{ backgroundColor: '#222222' }}>
            <ScrollView>
                <View style={{ top: Ratio(20) }}>
                    {button1Visible && (
                        <Button
                            style={{ ...styles.button, height: 500 }}
                            title="Button1: Toggle Button 2 visibility"
                            textStyle={styles.buttonTextStyle}
                        />
                    )}
                    <View>
                        <Button
                            style={{ ...styles.button, marginTop: 100, ...button2 }}
                            title="Button5"
                            textStyle={styles.buttonTextStyle}
                        />
                        <RecyclableList
                            type="row"
                            dataProvider={dataProvider}
                            layoutProvider={layoutProvider.current}
                            rowRenderer={rowRenderer}
                            style={[{ width: 1200, height: 150 }]}
                            isHorizontal
                            scrollViewProps={{
                                showsHorizontalScrollIndicator: false,
                            }}
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
        marginTop: getScaledValue(20),
    },
    buttonTextStyle: {
        color: '#ffffff',
        fontSize: Ratio(20),
    },
    packshot: {
        width: Ratio(200),
        height: Ratio(200),
        margin: Ratio(5),
    },
    image: {
        width: '100%',
        height: '100%',
    },
    button1Pos: {},
    button2Pos: {
        left: Ratio(400),
    },
});

export default DynamicState;

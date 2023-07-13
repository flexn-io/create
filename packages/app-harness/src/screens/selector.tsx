import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView, View, Text, FlashList, CreateListRenderItemInfo, Pressable } from '@flexn/create';
import { getScaledValue, platform } from '@rnv/renative';
import Screen from './screen';
import testsList from '../testsList';
import { Ratio } from '../utils';

const Selector = ({ navigation }: any) => {
    const renderItem = ({ item, focusRepeatContext }: CreateListRenderItemInfo<any>) => {
        return (
            <Pressable
                style={styles.button1}
                focusRepeatContext={focusRepeatContext}
                onPress={() => navigation.navigate(item.route)}
                focusOptions={{
                    animator: {
                        type: 'border',
                        focus: {
                            borderColor: 'blue',
                            borderWidth: 3,
                        },
                    },
                }}
            >
                <Text style={styles.buttonTextStyle}>{item.title}</Text>
            </Pressable>
        );
    };

    return (
        <Screen style={{ backgroundColor: '#222222', flex: 1 }}>
            <ScrollView>
                <View style={{ width: '100%', left: 5 }}>
                    <FlashList
                        data={testsList.filter((test) => test.platform.includes(platform))}
                        type="grid"
                        renderItem={renderItem}
                        numColumns={6}
                        horizontal={false}
                        estimatedItemSize={Ratio(200)}
                    />
                </View>
            </ScrollView>
        </Screen>
    );
};

const styles = StyleSheet.create({
    button1: {
        width: '96%',
        height: Ratio(200),
        borderWidth: 1,
        borderColor: 'red',
        marginVertical: 20,
    },
    button: {
        marginHorizontal: getScaledValue(20),
        borderWidth: getScaledValue(2),
        borderRadius: getScaledValue(25),
        borderColor: '#62DBFB',
        height: getScaledValue(50),
        width: '80%',
        marginTop: getScaledValue(20),
    },
    buttonTextStyle: {
        color: '#ffffff',
        fontSize: 20,
        paddingTop: 5,
        paddingLeft: 5,
    },
});

export default Selector;

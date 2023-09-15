import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { ScrollView, View, Text, FlashList, CreateListRenderItemInfo, Pressable } from '@flexn/create';
import { getScaledValue, platform } from '@rnv/renative';
import type { NavigationProps } from '../navigation';
import Screen from './screen';
import testsList, { Test } from '../testsList';
import { Ratio, testProps } from '../utils';

const Selector = ({ navigation }: NavigationProps) => {
    const { width, height } = useWindowDimensions();
    const tests = testsList().filter((test: Test) => test.platform.includes(platform));

    const renderItem = ({ item, focusRepeatContext }: CreateListRenderItemInfo<any>) => {
        return (
            <Pressable
                {...testProps(`harness-home-${item.id}-pressable`)}
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
                <Text style={styles.buttonTextStyle}>{`#${item.id} ${item.title}`}</Text>
            </Pressable>
        );
    };

    if (tests.length > 0) {
        return (
            <Screen style={{ backgroundColor: '#222222', flex: 1 }}>
                <ScrollView>
                    <View style={{ width: '100%', left: 5 }}>
                        <FlashList
                            data={tests}
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
    }

    return (
        <View style={{ backgroundColor: '#222222', width, height, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white' }}>No test cases found for {platform}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    button1: {
        width: '96%',
        height: Ratio(200),
        borderWidth: 1,
        borderColor: 'red',
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
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

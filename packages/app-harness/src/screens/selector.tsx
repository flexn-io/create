import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView, View } from '@flexn/create';
import { getScaledValue } from '@rnv/renative';
import Screen from './screen';
import { Button } from '../components/Button';
import testsList from '../testsList';

const Selector = ({ navigation }) => {
    return (
        <Screen style={{ backgroundColor: '#222222', flex: 1 }}>
            <ScrollView>
                <View style={{ alignItems: 'center', flex: 1, paddingBottom: 20 }}>
                    {testsList.map((test) => (
                        <Button
                            key={test.route}
                            title={test.title}
                            style={styles.button}
                            textStyle={styles.buttonTextStyle}
                            onPress={() => navigation.navigate(test.route)}
                        />
                    ))}
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
        width: '80%',
        marginTop: getScaledValue(20),
    },
    buttonTextStyle: {
        color: '#ffffff',
        fontSize: 20,
    },
});

export default Selector;

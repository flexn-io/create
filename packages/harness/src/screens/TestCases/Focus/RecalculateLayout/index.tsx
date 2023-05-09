import React, { useState } from 'react';
import {
    Screen,
    ScrollView,
    Text,
    Pressable
} from '@flexn/create';

const RecalculateLayout = () => {
    const [borderWidth, setBorderWidth] = useState(1);

    const onPress = (bw) => {
        setBorderWidth(bw);
    };

    return (
        <Screen style={{ flex: 1 }}>
            <ScrollView>
                <Pressable style={{ width: 300, height: 200, borderColor: 'red', borderWidth: borderWidth, left: 50, marginTop: 100, justifyContent: 'center', alignItems: 'center' }} onPress={() => onPress(3)}>
                    <Text style={{ color: 'white'}}>Button 1</Text>
                </Pressable>

                <Pressable style={{ width: 300, height: 200, borderColor: 'red', borderWidth: borderWidth, left: 50, marginTop: 250, justifyContent: 'center', alignItems: 'center' }} onPress={() => onPress(2)}>
                    <Text style={{ color: 'white'}}>Button 2</Text>
                </Pressable>

                <Pressable style={{ width: 300, height: 200, borderColor: 'red', borderWidth: borderWidth, left: 50, marginTop: 250, justifyContent: 'center', alignItems: 'center' }} onPress={() => onPress(4)}>
                    <Text style={{ color: 'white'}}>Button 3</Text>
                </Pressable>

                <Pressable style={{ width: 300, height: 200, borderColor: 'red', borderWidth: borderWidth, left: 50, marginTop: 250, justifyContent: 'center', alignItems: 'center' }} onPress={() => onPress(1 + Math.random())}>
                    <Text style={{ color: 'white'}}>Button 4</Text>
                </Pressable>
            </ScrollView>
        </Screen>
    );
};

export default RecalculateLayout;

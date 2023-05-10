// @ts-ignore
import React from 'react';
// import { FlatList } from 'react-native';
// import { PosterCard, View, Text, Pressable, FlatList } from '@flexn/create';
import { PosterCard, ScrollView, View } from '@flexn/create';
import Screen from '../../../../components/Screen';

const NonScrollableScrollView = () => {
    const array = [];
    const renderCards = () => {
        return array.map((i) => (
            <PosterCard
                src={{ uri: `https://placekitten.com/250/250` }}
                key={i}
                style={{
                    width: 250,
                    height: 250,
                    marginHorizontal: 15,
                }}
            />
        ));
    };

    return (
        <Screen>
            <ScrollView horizontal>
                <View style={{ flexDirection: 'row' }}>{renderCards()}</View>
            </ScrollView>
        </Screen>
    );
};

export default NonScrollableScrollView;

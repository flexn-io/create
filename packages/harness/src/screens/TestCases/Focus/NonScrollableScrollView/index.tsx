// @ts-ignore
import React from 'react';
// import { FlatList } from 'react-native';
// import { PosterCard, View, Text, Pressable, FlatList } from '@flexn/sdk';
import { PosterCard, ScrollView, View } from '@flexn/sdk';
import Screen from '../../../../components/Screen';

const NonScrollableScrollView = () => {
    const array = [];
    const renderCards = () => {
        return array.map(() => (
            <PosterCard
                src={{ uri: `https://placekitten.com/250/250` }}
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
                <View style={{ flexDirection: 'row' }}>
                    {renderCards()}
                </View>
            </ScrollView>
        </Screen>
    );
};

export default NonScrollableScrollView;

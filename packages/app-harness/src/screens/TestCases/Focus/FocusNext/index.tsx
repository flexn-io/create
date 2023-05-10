import React from 'react';
import { PosterCard, ScrollView, View } from '@flexn/create';
import Screen from '../../../../components/Screen';

const CardTest = () => {
    return (
        <Screen>
            <ScrollView>
                <View style={{ height: 2000 }}>
                    <PosterCard
                        src={{ uri: `https://placekitten.com/250/250` }}
                        style={{
                            width: 250,
                            height: 250,
                            marginHorizontal: 15,
                            position: 'absolute',
                            top: 1500,
                            right: 400,
                        }}
                        focusOptions={{
                            focusKey: 'card1',
                            animatorOptions: {
                                type: 'scale',
                                scale: 1.5,
                            },
                        }}
                    />
                    <PosterCard
                        src={{ uri: `https://placekitten.com/250/250` }}
                        style={{ width: 250, height: 250, marginHorizontal: 15 }}
                        focusOptions={{
                            focusKey: 'card2',
                            nextFocusRight: 'card1',
                            animatorOptions: {
                                type: 'scale',
                                scale: 1.5,
                            },
                        }}
                    />
                    <PosterCard
                        src={{ uri: `https://placekitten.com/250/250` }}
                        style={{ width: 250, height: 250, marginHorizontal: 15, top: 200 }}
                        focusOptions={{
                            focusKey: 'card3',
                            animatorOptions: {
                                type: 'scale',
                                scale: 1.5,
                            },
                        }}
                    />
                </View>
            </ScrollView>
        </Screen>
    );
};

export default CardTest;

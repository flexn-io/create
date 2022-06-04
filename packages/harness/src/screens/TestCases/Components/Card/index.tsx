import React from 'react';
import { PosterCard } from '@flexn/sdk';
import Screen from '../../../../components/Screen';

const CardTest = () => {
    return (
        <Screen
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
            }}
        >
            <PosterCard
                src={{ uri: `https://placekitten.com/500/500` }}
                style={{ width: 500, height: 500, marginHorizontal: 15 }}
            />
            <PosterCard
                src={{ uri: `https://placekitten.com/500/500` }}
                style={{ width: 500, height: 500, marginHorizontal: 15 }}
            />
            <PosterCard
                src={{ uri: `https://placekitten.com/500/500` }}
                style={{ width: 500, height: 500, marginHorizontal: 15 }}
            />
        </Screen>
    );
};

export default CardTest;

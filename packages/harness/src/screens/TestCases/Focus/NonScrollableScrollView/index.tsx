import React from 'react';
import { PosterCard, ScrollView } from '@flexn/sdk';
import Screen from '../../../../components/Screen';

const NonScrollableScrollView = () => {
    return (
        <Screen>
            {/* <PosterCard
                src={{ uri: `https://placekitten.com/250/250` }}
                style={{ width: 250, height: 250, marginHorizontal: 15, position: 'absolute' }}
                focusOptions={{
                    // focusKey: 'card2',
                    nextFocusRight: 'card1',
                    animatorOptions: {
                        type: 'scale',
                        scale: 1.1,
                    },
                }}
            /> */}
            <PosterCard
                src={{ uri: `https://placekitten.com/250/250` }}
                style={{ width: 250, height: 250, marginHorizontal: 15, left: 520, position: 'absolute' }}
                focusOptions={{
                    // focusKey: 'card2',
                    nextFocusRight: 'card1',
                    animatorOptions: {
                        type: 'scale',
                        scale: 1.1,
                    },
                }}
            />
            <PosterCard
                src={{ uri: `https://placekitten.com/250/250` }}
                style={{ width: 250, height: 250, marginHorizontal: 15, top: 550, left: 225, position: 'absolute' }}
                focusOptions={{
                    // focusKey: 'card3',
                    animatorOptions: {
                        type: 'scale',
                        scale: 1.1,
                    },
                }}
            />
        </Screen>
    );
};

export default NonScrollableScrollView;

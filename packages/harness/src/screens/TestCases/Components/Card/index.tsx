import React from 'react';
import { Card } from '@flexn/sdk';
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
            debugName="CardTest"
        >
            <Card src={{uri: `https://placekitten.com/500/500` }} style={{width: 500, height: 500, marginHorizontal: 15}} />
            <Card src={{uri: `https://placekitten.com/500/500` }} style={{width: 500, height: 500, marginHorizontal: 15}} />
            <Card src={{uri: `https://placekitten.com/500/500` }} style={{width: 500, height: 500, marginHorizontal: 15}} />
        </Screen>
    );
};

export default CardTest;
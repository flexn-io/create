import React from 'react';
import { PosterCard, Pressable } from '@flexn/sdk';
import Screen from '../../../../components/Screen';

const CardTest = () => {
    const [show, setShow] = React.useState(true);
    const [show1, setShow1] = React.useState(true);
    const [show2, setShow2] = React.useState(true);

    React.useEffect(() => {
        setTimeout(() => {
            setShow(false);
            // setShow1(false);
        }, 2000);
    }, []);
    return (
        <Screen
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
            }}
        >
            {show && (
                <PosterCard
                    src={{ uri: `https://placekitten.com/500/500` }}
                    style={{ width: 500, height: 500, marginHorizontal: 15 }}
                />
            )}
            {show1 && (
                <PosterCard
                    src={{ uri: `https://placekitten.com/500/500` }}
                    style={{ width: 500, height: 500, marginHorizontal: 15 }}
                />
            )}
            <PosterCard
                src={{ uri: `https://placekitten.com/500/500` }}
                style={{ width: 500, height: 500, marginHorizontal: 15 }}
            />
        </Screen>
    );
};

export default CardTest;

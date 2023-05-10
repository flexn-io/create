import React, { useEffect, useState } from 'react';
import { Row, View } from '@flexn/create';
import Screen from '../../../../components/Screen';

const kittyNames = ['Abby', 'Angel', 'Annie', 'Baby', 'Bailey', 'Bandit'];

function interval(min = 0, max = kittyNames.length - 1) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateData(width, height, items = 30) {
    const temp: any = [];
    for (let index = 0; index < items; index++) {
        temp.push({
            index,
            backgroundImage: `https://placekitten.com/${width + index}/${height}`,
            title: `${kittyNames[interval()]} ${kittyNames[interval()]} ${kittyNames[interval()]}`,
        });
    }

    return temp;
}

const RowTest = () => {
    const [hideModal, setHideModal] = useState(false);
    const data = [...generateData(400, 250, 10)];

    useEffect(() => {
        setTimeout(() => {
            setHideModal(true);
        }, 4000);
    }, []);

    return (
        <View>
            {!hideModal && (
                <Screen stealFocus screenOrder={1} focusOptions={{ nextFocusDown: 's2' }}>
                    <View style={{ marginTop: 100 }}>
                        {/* <Pressable style={{ width: 300, height: 100, borderColor: 'red', borderWidth: 1 }} /> */}
                    </View>
                </Screen>
            )}
            <Screen stealFocus={false} focusOptions={{ focusKey: 's2' }}>
                <View style={{ marginTop: 400 }}>
                    {/* {!hideModal && (
                        <Pressable style={{ width: 300, height: 100, borderColor: 'red', borderWidth: 1 }} />
                    )} */}
                    <Row
                        items={data}
                        itemsInViewport={5}
                        style={{ height: 500, marginLeft: 0 }}
                        itemSpacing={30}
                        itemDimensions={{ height: 400 }}
                    />
                </View>
            </Screen>
        </View>
    );
};

export default RowTest;

//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView, View, FlashList, Pressable, Image } from '@flexn/create';
import Screen from './screen';

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

const List = ({ estimatedRowHeight, data, rowRenderer, parentContext }) => {
    const initialRenderIndex = 5;
    const [renderStack, setRenderStack] = useState([]);
    const [renderedBoundaries, setRenderedBoundaries] = useState([0, 5]);

    useEffect(() => {
        const initialData = data.slice(0, initialRenderIndex);
        const stack = [];
        initialData.forEach((d) => {
            stack.push(rowRenderer(d));
        });
        setRenderStack(stack);
    }, []);

    useEffect(() => {
        if (renderedBoundaries[1] === 5) return;

        const renderData = data.slice(renderedBoundaries[1], renderedBoundaries[1] + 1);
        const stack = renderStack;
        renderData.forEach((d) => {
            stack.push(rowRenderer(d));
        });
        setRenderStack(stack);
    }, [renderedBoundaries]);

    const onScroll = () => {
        setRenderedBoundaries([renderedBoundaries[1] + 1 - initialRenderIndex, renderedBoundaries[1] + 1]);
    };

    // console.log({ renderStack });
    return (
        <ScrollView
            parentContext={parentContext}
            onScroll={onScroll}
            contentContainerStyle={{ height: estimatedRowHeight * data.length }}
        >
            {renderStack}
        </ScrollView>
    );
};

const Row = () => {
    const [data] = useState([
        generateData(200, 200, 100),
        generateData(200, 200, 100),
        generateData(200, 200, 100),
        generateData(200, 200, 100),
        generateData(200, 200, 100),
        generateData(200, 200, 100),
        generateData(200, 200, 100),
        generateData(200, 200, 100),
        generateData(200, 200, 100),
        generateData(200, 200, 100),
        generateData(200, 200, 100),
    ]);
    // const [data2] = useState(generateData(200, 200, 100));

    const rowRenderer = ({ item }, contextInfo) => {
        return (
            <Pressable style={styles.packshot} focusRepeatContext={contextInfo}>
                <Image source={{ uri: item.backgroundImage }} style={styles.image} />
            </Pressable>
        );
    };

    const listRowRenderer = (data) => {
        return (
            <View style={styles.view}>
                <FlashList data={data} rowRenderer={rowRenderer} horizontal />
            </View>
        );
    };

    return (
        <Screen style={{ backgroundColor: '#222222' }}>
            <List data={data} renderItem={listRowRenderer} estimatedRowHeight={200} />
        </Screen>
    );
};

const styles = StyleSheet.create({
    packshot: {
        width: 200,
        height: 200,
        // borderColor: 'red',
        // borderWidth: 1,
        margin: 5,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    view: {
        marginVertical: 10,
    },
});

export default Row;

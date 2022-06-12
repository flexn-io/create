// @ts-ignore
import React from 'react';
// import { FlatList } from 'react-native';
// import { PosterCard, View, Text, Pressable, FlatList } from '@flexn/sdk';
import { PosterCard } from '@flexn/sdk';
import Screen from '../../../../components/Screen';

// const LETTERS = [
//     'A',
//     'B',
//     'C',
//     'D',
//     'E',
//     'F',
//     'G',
//     'H',
//     'I',
//     'J',
//     'K',
//     'L',
//     'M',
//     'N',
//     'O',
//     'P',
//     'Q',
//     'R',
//     'S',
//     'T',
//     'U',
//     'V',
//     'W',
//     'X',
//     'Y',
//     'Z',
//     '1',
//     '2',
//     '3',
//     '4',
//     '5',
//     '6',
//     '7',
//     '8',
//     '9',
//     '0',
// ];

// const SPECIAL = [
//     { key: '@gmail.com', value: '@gmail.com' },
//     { key: '@yahoo.com', value: '@yahoo.com' },
//     { key: '.com', value: '.com' },
//     { key: '.net', value: '.net' },
//     { key: '.net', value: '.net' },
//     { key: '.net', value: '.net' },
//     { key: '.net', value: '.net' },
//     { key: '.net', value: '.net' },
//     { key: '.net', value: '.SLKFLKDSFKLJDSLKFJSDFKJLLDJKSFJKL' },
// ];


const NonScrollableScrollView = () => {
    // const renderFlItem = (item, parentContext) => {
    //     return (
    //         <Pressable parentContext={parentContext} style={{ minWidth: 70, height: 70, borderColor: 'white', borderWidth: 1 }}>
    //             <Text style={{ color: 'white', fontSize: 25 }}>{item.value ?? item}</Text>
    //         </Pressable>
    //     );
    // };

    // const renderFL1 = () => {
    //     return (
    //         <FlatList
    //             data={LETTERS}
    //             numColumns={6}
    //             horizontal={false}
    //             removeClippedSubviews={true}
    //             keyExtractor={(index) => index.toString()}
    //             renderItem={({ item, parentContext }) => renderFlItem(item, parentContext)}
    //         />
    //     );
    // };

    // const renderFL2 = () => {
    //     return (
    //         <FlatList
    //             data={SPECIAL}
    //             numColumns={4}
    //             horizontal={false}
    //             removeClippedSubviews={true}
    //             keyExtractor={(index) => index.toString()}
    //             renderItem={({ item, parentContext }) => renderFlItem(item, parentContext)}
    //         />
    //     );
    // };

    return (
        <Screen>
            {/* <View style={{ position: 'absolute', left: 800 }}>
                {renderFL1()}
            </View>
            <View style={{ position: 'absolute', left: 800, top: 450 }}>
                {renderFL2()}
            </View> */}
            <PosterCard
                src={{ uri: `https://placekitten.com/250/250` }}
                style={{
                    width: 250,
                    height: 250,
                    marginHorizontal: 15,
                    position: 'absolute',
                    left: 50
                }}
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
                style={{
                    width: 250,
                    height: 250,
                    marginHorizontal: 15,
                    left: 490,
                    top: 200,
                    position: 'absolute'
                }}
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
                style={{ width: 250, height: 250, marginHorizontal: 15, top: 550, left: 180, position: 'absolute' }}
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

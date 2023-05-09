// @ts-nocheck
/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { Screen, RecyclableList, RecyclableListDataProvider, RecyclableListLayoutProvider } from '@flexn/create';

import ContextHelper from './ContextHelper';
import Row from './row';

const { width } = Dimensions.get('window');

function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

const ListOfRows = () => {
    const parentArray: any = useRef([]);
    const childArray: any = useRef([]);
    const childrenCachePositions: any = useRef();

    const [dataProvider, setDataProvider] = useState(
        new RecyclableListDataProvider((r1, r2) => {
            return r1 !== r2;
        }).cloneWithRows(parentArray.current)
    );
    const parentContextProvider = useRef(new ContextHelper('PARENT'));
    const parentRLVLayoutProvider = useRef(
        new RecyclableListLayoutProvider(
            () => '_',
            (type, dim) => {
                dim.height = 300;
                dim.width = width;
            }
        )
    );

    const generateData = () => {
        parentArray.current = new Array(320);

        for (let i = 0; i < parentArray.current.length; i++) {
            childArray.current = shuffle([
                i,
                'Banana',
                'Custard Apple',
                'Dragon Fruit',
                'Egg Fruit',
                'Finger Lime',
                'Grapes',
                'Honeydew Melon',
                'Indonesian Lime',
                'Jackfruit',
                'Kiwi',
                'Lychee',
                'Mango',
                'Navel Orange',
                'Oranges',
                'Pomegranate',
                'Queen Anne Cherry',
                'Raspberries',
                'Strawberries',
                'Tomato',
                'Ugni',
                'Vanilla Bean',
                'Watermelon',
                'Ximenia caffra fruit',
                'Yellow Passion Fruit',
                'Zuchinni',
            ]);

            parentArray.current[i] = {
                dataProvider: new RecyclableListDataProvider((r1, r2) => {
                    return r1 !== r2;
                }).cloneWithRows(childArray.current),
                contextProvider: new ContextHelper(i + ''),
                uniqueId: i + '',
            };
        }

        setDataProvider(
            new RecyclableListDataProvider((r1, r2) => {
                return r1 !== r2;
            }).cloneWithRows(parentArray.current)
        );
    };

    const cachePosition = (uniqueId, position) => {
        childrenCachePositions[uniqueId] = position;
    };

    const getCachePosition = (uniqueId) => {
        if (childrenCachePositions[uniqueId]) {
            return childrenCachePositions[uniqueId];
        }
        return 0;
    };

    const rowRenderer = (_type, data, _index, repeatContext) => {
        return (
            <Row
                data={data}
                uniqueId={data.uniqueId}
                cachePosition={cachePosition}
                getCachePosition={getCachePosition}
                repeatContext={repeatContext}
                index={_index}
                parentContext={{}}
            />
        );
    };

    useEffect(() => {
        generateData();
    }, []);

    return (
        <Screen style={{ flex: 1 }}>
            <RecyclableList
                type="list"
                isHorizontal={false}
                contextProvider={parentContextProvider.current}
                layoutProvider={parentRLVLayoutProvider.current}
                dataProvider={dataProvider}
                rowRenderer={rowRenderer}
                style={{ flex: 1 }}
                renderAheadOffset={500}
            />
        </Screen>
    );
};

export default ListOfRows;

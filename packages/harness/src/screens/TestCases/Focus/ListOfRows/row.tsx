// @ts-nocheck
/* eslint-disable */
import React, { useRef, useState } from 'react';
import {
    View,
    Pressable,
    Text,
    RecyclableList,
    RecyclableListDataProvider,
    RecyclableListLayoutProvider,
} from '@flexn/create';
import { useEffect } from 'react';

const Row = ({ parentContext, data, uniqueId, cachePosition, getCachePosition, repeatContext, index }) => {
    const [uniqId, setUniqId] = useState(uniqueId);
    const list: any = useRef();
    const childRLVLayoutProvider = useRef(
        new RecyclableListLayoutProvider(
            () => '_',
            (type, dim) => {
                dim.height = 300;
                dim.width = 300;
            }
        )
    );

    // useEffect(() => {
    //     // setUniqId(uniqueId);
    //     // console.log('uniqueId', uniqueId, list.current);

    //     if (list.current) {
    //         cachePosition(uniqueId, list.current.getCurrentScrollOffset());
    //         list.current.scrollToOffset(getCachePosition(uniqueId), 0, false);
    //         console.log('list.current.scrollToOffset', getCachePosition(uniqueId));
    //     }
    // }, [uniqueId]);

    // console.log('index', index);

    const rowRenderer = (_type, _data, _index, _repeatContext) => {
        // console.log('uniqueId_NEW', index, uniqueId);

        // return null;
        return (
            <Pressable
                repeatContext={_repeatContext}
                style={{
                    width: 280,
                    height: 280,
                    borderColor: 'red',
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: 'white', fontSize: 30 }}>{_data}</Text>
            </Pressable>
        );
    };

    return (
        <View parentContext={parentContext} style={{ flex: 1 }}>
            <RecyclableList
                type="row"
                ref={list}
                style={{ flex: 1 }}
                showsHorizontalScrollIndicator={false}
                isHorizontal={true}
                dataProvider={data.dataProvider}
                contextProvider={data.contextProvider}
                layoutProvider={childRLVLayoutProvider.current}
                forceNonDeterministicRendering={true}
                rowRenderer={rowRenderer}
                repeatContext={repeatContext}
                cachePosition={cachePosition}
                getCachePosition={getCachePosition}
                uniqueId={uniqueId}
            />
        </View>
    );
};

export default Row;

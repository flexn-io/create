import React, { useState, useRef } from 'react';
import { Dimensions, View } from 'react-native';
import {
    DataProvider as RecyclableListDataProvider,
    LayoutProvider as RecyclableListLayoutProvider,
    RecyclerListView,
} from '../../recyclerListView';

import { Context } from '../../focusManager/types';

const { width } = Dimensions.get('screen');

const Row = ({ repeatContext, renderRow }: { repeatContext: Context, renderRow: any}) => {
    const { parentContext, index } = repeatContext;
    const dataProviderInstance = new RecyclableListDataProvider((r1: any, r2: any) => r1 !== r2);
    const [dataProvider, setDataProvider] = useState<null | RecyclableListDataProvider>(null);

    React.useEffect(() => {
        setDataProvider(dataProviderInstance.cloneWithRows(repeatContext.data.items));
    }, [repeatContext.data.items]);

    const layoutProvider = useRef(
        new RecyclableListLayoutProvider(
            () => '_',
            (_, dim) => {
                dim.width = width;
                dim.height = 600;
            }
        )
    ).current;

    return (
        <RecyclerListView
            repeatContext={{ parentContext, index }}
            // nestedParentContext={parentContext}
            layoutProvider={layoutProvider}
            //@ts-ignore
            dataProvider={dataProvider}
            scrollViewProps={{
                showsHorizontalScrollIndicator: false,
            }}
            rowRenderer={(rowRepeatContext: any) => {
                // console.log('repeatContext111', rowRepeatContext);

                return renderRow(rowRepeatContext);
            }}
            style={{ marginHorizontal: 15, marginVertical: 50 }}
            contentContainerStyle={{ minHeight: 600, minWidth: width }}
            horizontal
        />
    );
};

const VerticalRecyclableList = ({ renderRow, data, parentContext, styles = {} }: any) => {
    const dataProviderInstance = new RecyclableListDataProvider((r1, r2) => r1 !== r2);
    const [dataProvider, setDataProvider] = useState<null | RecyclableListDataProvider>(null);

    React.useEffect(() => {
        setDataProvider(dataProviderInstance.cloneWithRows(data));
    }, [data]);

    const layoutProvider = useRef(
        new RecyclableListLayoutProvider(
            () => '_',
            (_, dim) => {
                dim.width = 200;
                dim.height = 200;
            }
        )
    ).current;

    const rowRenderer = (repeatContext: any) => {
        return <Row repeatContext={repeatContext} renderRow={renderRow} />;
    };

    if (dataProvider) {
        return (
            <View>
                <RecyclerListView
                    //@ts-ignore
                    parentContext={parentContext}
                    horizontal={false}
                    scrollViewProps={{
                        showsVerticalScrollIndicator: false,
                    }}
                    style={styles.content}
                    contentContainerStyle={[styles.contentContainer, { height: 9999, width }]}
                    dataProvider={dataProvider}
                    layoutProvider={layoutProvider}
                    rowRenderer={rowRenderer}
                    bounces={false}
                />
            </View>
        );
    }

    return null;
};

export default VerticalRecyclableList;
export { RecyclableListDataProvider, RecyclableListLayoutProvider };

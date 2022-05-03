import {
    focusElementByFocusKey,
    TouchableOpacity,
    RecyclableList,
    RecyclableListDataProvider,
    RecyclableListLayoutProvider,
    Screen,
    ScrollView,
    View,
} from '@flexn/sdk';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { getScaledValue } from '@rnv/renative';
import Theme, { themeStyles } from '../../../config';

const Modal = ({ onClose }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onInnerModalClose = () => {
        setIsModalOpen(false);
        focusElementByFocusKey('MainModal');
    };

    return (
        <>
            <Screen
                screenState="foreground"
                screenOrder={1}
                style={styles.modalScreen}
                focusOptions={{ focusKey: 'MainModal' }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalRow1}>
                        <TouchableOpacity style={styles.modalItem} onPress={onClose} focus>
                            <Text style={styles.textModalItem}>CLOSE MODAL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalItem} onPress={onClose} focus>
                            <Text style={styles.textModalItem}>CLOSE MODAL</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalRow2}>
                        <TouchableOpacity style={styles.modalItem} onPress={() => setIsModalOpen(true)} focus>
                            <Text style={styles.textModalItem}>OPEN ANOTHER MODAL</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Screen>
            {isModalOpen && (
                <Screen screenState="foreground" screenOrder={2} style={styles.secondModalScreen}>
                    <View style={styles.secondModalContainer}>
                        <View style={styles.secondModalRow1}>
                            <TouchableOpacity style={styles.modalItem} onPress={() => onInnerModalClose()} focus>
                                <Text style={styles.textModalItem}>CLOSE MODAL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalItem} onPress={() => onInnerModalClose()} focus>
                                <Text style={styles.textModalItem}>CLOSE MODAL</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={styles.modalItem} onPress={() => onInnerModalClose()} focus>
                                <Text style={styles.textModalItem}>CLOSE MODAL</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Screen>
            )}
        </>
    );
};

const SecondScreen = ({ onBack }) => {
    const [screenState, setScreenState] = useState('foreground');

    useEffect(() => {
        setScreenState('foreground');

        return () => {
            setScreenState('background');
        };
    }, []);

    return (
        <Screen screenState={screenState} style={styles.secondScreen}>
            <View style={styles.secondSreenRowContainer1}>
                <TouchableOpacity style={styles.secondScreenItem} onPress={onBack} focus>
                    <Text style={styles.secondScreenText}>GO BACK</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondScreenItem} onPress={onBack} focus>
                    <Text style={styles.secondScreenText}>GO BACK</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.secondSreenRowContainer2}>
                <TouchableOpacity style={styles.secondScreenItem} onPress={onBack} focus>
                    <Text style={styles.secondScreenText}>GO BACK</Text>
                </TouchableOpacity>
            </View>
        </Screen>
    );
};

const MainScreen = ({ onOpenModal, onScreenSwitch, dataProvider }) => {
    const [screenState, setScreenState] = useState('foreground');

    useEffect(() => {
        setScreenState('foreground');

        return () => {
            setScreenState('background');
        };
    }, []);

    const layoutProvider = useRef(
        new RecyclableListLayoutProvider(
            (index) => dataProvider.getDataForIndex(index).type,
            (type, dim) => {
                dim.width = getScaledValue(150);
                dim.height = getScaledValue(75);
            }
        )
    ).current;

    return (
        <Screen screenState={screenState} focusOptions={{ focusKey: 'Main' }}>
            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem} focus />
                <TouchableOpacity style={styles.menuItem} focus />
            </View>
            <ScrollView style={styles.mainScrollView}>
                <TouchableOpacity style={styles.outsideItem} focus />
                <View style={styles.mainContainer}>
                    <Text style={themeStyles.textH2}> Focus Test 1 (Misaligned buttons) </Text>
                    <View style={styles.rowContainer1}>
                        <TouchableOpacity style={styles.item} focus={{ hasTVPreferredFocus: true }} />
                        <TouchableOpacity style={styles.itemOpenModal} focus onPress={onOpenModal}>
                            <Text style={styles.textOpenModal}>OPEN MODAL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.item} focus />
                    </View>
                    <View style={styles.rowContainer2}>
                        <TouchableOpacity style={styles.item} focus />
                    </View>
                    <View style={styles.rowContainer3}>
                        <TouchableOpacity style={styles.item} focus />
                        <TouchableOpacity style={styles.item} focus />
                    </View>
                    <View style={styles.rowContainer4}>
                        <TouchableOpacity style={styles.item} focus />
                        <TouchableOpacity style={styles.item} focus />
                        <TouchableOpacity style={styles.item} focus />
                    </View>
                    <View style={styles.rowContainer5}>
                        <TouchableOpacity style={styles.item} focus />
                        <TouchableOpacity style={styles.item} focus />
                        <TouchableOpacity style={styles.item} focus />
                    </View>
                    <View style={styles.rowContainer6}>
                        <TouchableOpacity style={styles.item} focus />
                        <TouchableOpacity style={styles.itemScreenSwitch} focus onPress={onScreenSwitch}>
                            <Text style={styles.textScreenSwitch}>SWITCH SCREEN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.item} focus />
                    </View>
                    <ScrollView horizontal style={styles.horizontalScrollView} focus>
                        <TouchableOpacity style={styles.horizontalScrollViewItem} focus />
                        <TouchableOpacity style={styles.horizontalScrollViewItem} focus />
                        <TouchableOpacity style={styles.horizontalScrollViewItem} focus />
                        <TouchableOpacity style={styles.horizontalScrollViewItem} focus />
                        <TouchableOpacity style={styles.horizontalScrollViewItem} focus />
                        <TouchableOpacity style={styles.horizontalScrollViewItem} focus />
                        <TouchableOpacity style={styles.horizontalScrollViewItem} focus />
                        <TouchableOpacity style={styles.horizontalScrollViewItem} focus />
                        <TouchableOpacity style={styles.horizontalScrollViewItem} focus />
                        <TouchableOpacity style={styles.horizontalScrollViewItem} focus />
                        <TouchableOpacity style={styles.horizontalScrollViewItem} focus />
                    </ScrollView>
                    <View style={styles.rowContainer7}>
                        <TouchableOpacity style={styles.item} focus />
                        <TouchableOpacity style={styles.item} focus />
                        <TouchableOpacity style={styles.item} focus />
                    </View>
                    <View style={styles.rowContainer7}>
                        <TouchableOpacity style={styles.item} focus />
                        <TouchableOpacity style={styles.item} focus />
                        <TouchableOpacity style={styles.item} focus />
                    </View>
                    <RecyclableList
                        dataProvider={dataProvider}
                        layoutProvider={layoutProvider}
                        rowRenderer={(_type, data, _index, repeatContext) => (
                            <TouchableOpacity style={styles.recyclerItem} focus repeatContext={repeatContext}>
                                <Text>{data?.text}</Text>
                            </TouchableOpacity>
                        )}
                        isHorizontal
                        style={styles.recycler}
                    />
                    <View style={styles.rowContainer7}>
                        <TouchableOpacity style={styles.item} focus />
                        <TouchableOpacity style={styles.item} focus />
                        <TouchableOpacity style={styles.item} focus />
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
};

const Example1 = () => {
    const generateData = (size) => {
        const data = [];
        for (let i = 0; i < size; i++) {
            data.push({ type: 'FL_ITEM', text: `Row${i}` });
        }
        return data;
    };
    const [isModalOpen, setModalOpen] = useState(false);
    const [isScreenSwitched, setScreenSwitched] = useState(false);
    const [dataProvider] = useState(
        new RecyclableListDataProvider((r1, r2) => r1 !== r2).cloneWithRows(generateData(20))
    );

    return (
        <>
            {isScreenSwitched ? (
                <SecondScreen onBack={() => setScreenSwitched(false)} />
            ) : (
                <MainScreen
                    onOpenModal={() => setModalOpen(true)}
                    onScreenSwitch={() => setScreenSwitched(true)}
                    dataProvider={dataProvider}
                />
            )}
            {isModalOpen && (
                <Modal
                    onClose={() => {
                        setModalOpen(false);
                        focusElementByFocusKey('Main');
                    }}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    item: { width: getScaledValue(90), height: getScaledValue(50), backgroundColor: 'teal' },
    menuContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: getScaledValue(100),
        backgroundColor: 'red',
    },
    menuItem: {
        width: getScaledValue(90),
        height: getScaledValue(50),
        top: getScaledValue(50),
        backgroundColor: 'yellow',
        margin: getScaledValue(2.5),
    },
    mainScrollView: { marginLeft: getScaledValue(150) },
    mainContainer: { justifyContent: 'center', alignItems: 'center', flex: 1 },
    outsideItem: {
        width: getScaledValue(90),
        height: getScaledValue(50),
        backgroundColor: 'teal',
        marginTop: getScaledValue(20),
    },
    rowContainer1: { width: '85%', justifyContent: 'space-between', flexDirection: 'row' },
    rowContainer2: { width: '75%', justifyContent: 'center', alignItems: 'center' },
    rowContainer3: { width: '75%', justifyContent: 'space-between', flexDirection: 'row' },
    rowContainer4: {
        width: '95%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        margin: getScaledValue(30),
    },
    rowContainer5: {
        width: '55%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        margin: getScaledValue(30),
    },
    rowContainer6: {
        width: '65%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        margin: getScaledValue(30),
    },
    rowContainer7: {
        width: '65%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        margin: getScaledValue(50),
    },
    itemOpenModal: {
        width: getScaledValue(90),
        height: getScaledValue(50),
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemScreenSwitch: {
        width: getScaledValue(90),
        height: getScaledValue(50),
        backgroundColor: 'violet',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textOpenModal: { color: 'white', fontSize: getScaledValue(7.5) },
    textScreenSwitch: { color: 'black', fontSize: getScaledValue(7.5) },
    horizontalScrollView: { height: getScaledValue(150), width: '100%', backgroundColor: 'blue' },
    horizontalScrollViewItem: {
        width: getScaledValue(145),
        height: getScaledValue(50),
        backgroundColor: 'teal',
        margin: getScaledValue(5),
    },
    recycler: { width: '100%', height: getScaledValue(100) },
    recyclerItem: {
        width: getScaledValue(90),
        height: getScaledValue(50),
        backgroundColor: 'teal',
        margin: getScaledValue(5),
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
    },
    secondScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.color1,
    },
    secondSreenRowContainer1: { width: '75%', justifyContent: 'space-between', flexDirection: 'row' },
    secondSreenRowContainer2: { justifyContent: 'center', alignItems: 'center' },
    secondScreenItem: {
        width: getScaledValue(90),
        height: getScaledValue(50),
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondScreenText: { color: 'black', fontSize: getScaledValue(7.5) },
    modalScreen: {
        position: 'absolute',
        left: getScaledValue(150),
        top: getScaledValue(75),
        right: getScaledValue(150),
        bottom: getScaledValue(75),
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'grey',
    },
    modalRow1: {
        width: '75%',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    modalRow2: { justifyContent: 'center', alignItems: 'center' },
    modalItem: {
        width: getScaledValue(90),
        height: getScaledValue(50),
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textModalItem: { color: 'black', fontSize: getScaledValue(7.5) },
    secondModalScreen: {
        position: 'absolute',
        left: getScaledValue(300),
        top: getScaledValue(150),
        right: getScaledValue(300),
        bottom: getScaledValue(150),
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondModalContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'brown',
    },
    secondModalRow1: { width: '75%', justifyContent: 'space-between', flexDirection: 'row' },
    secondModalItem: {
        width: getScaledValue(90),
        height: getScaledValue(50),
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Example1;

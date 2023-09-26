import React from 'react';
import { ScrollView, StyleSheet, Text, useTVRemoteHandler, View } from '@flexn/create';
import { Screen, Animated } from '@flexn/create';
import Header, { HeaderHandle } from './components/Header';
import Row from './components/Row';
import { Item } from './components/Item';
import { mixAndMatch, Ratio } from './utils';

const AnimatedView = Animated.createAnimatedComponent(View);

const data1 = [
    {
        thumbSrc: require('./assets/listen-again/thumb/BlackSheep.png'),
        bgSrc: require('./assets/listen-again/bg/BlackSheep.png'),
        album: 'Black Sheep',
        title: 'Song by Metric',
    },
    {
        thumbSrc: require('./assets/listen-again/thumb/HouseofMemories.png'),
        bgSrc: require('./assets/listen-again/bg/HouseofMemories.png'),
        album: 'House of Memories',
        title: 'Song by Panic! At The Disco',
    },
    {
        thumbSrc: require('./assets/listen-again/thumb/Hysteria.png'),
        bgSrc: require('./assets/listen-again/bg/Hysteria.png'),
        album: 'Hysteria',
        title: 'Song by Muse',
    },
    {
        thumbSrc: require('./assets/listen-again/thumb/MyOrdinaryLife.png'),
        bgSrc: require('./assets/listen-again/bg/MyOrdinaryLife.jpeg'),
        album: 'My Ordinary Life',
        title: 'Song by The Living Tombstone',
    },
    {
        thumbSrc: require('./assets/listen-again/thumb/Notion.png'),
        bgSrc: require('./assets/listen-again/bg/Notion.png'),
        album: 'Notion',
        title: 'Song by The Rare Occasions',
    },
];

const data2 = [
    {
        thumbSrc: require('./assets/quick-picks/thumb/Brackish.png'),
        bgSrc: require('./assets/quick-picks/bg/Brackish.png'),
        album: 'Brackish',
        title: 'Song by Kittie',
    },
    {
        thumbSrc: require('./assets/quick-picks/thumb/KingforaDay.png'),
        bgSrc: require('./assets/quick-picks/bg/KingforaDay.png'),
        album: 'King for a Day',
        title: 'Song by Pierce The Veil',
    },
    {
        thumbSrc: require('./assets/quick-picks/thumb/NewMagicWand.png'),
        bgSrc: require('./assets/quick-picks/bg/NewMagicWand.png'),
        album: 'NEW MAGIC WAND',
        title: 'Song by Tyler, the Creator',
    },
    {
        thumbSrc: require('./assets/quick-picks/thumb/Obsession.png'),
        bgSrc: require('./assets/quick-picks/bg/Obsession.png'),
        album: 'Obsession',
        title: 'Song by Gesaffelstein',
    },
    {
        thumbSrc: require('./assets/quick-picks/thumb/Opr.png'),
        bgSrc: require('./assets/quick-picks/bg/Opr.png'),
        album: 'Opr',
        title: 'Song by Gesaffelstein',
    },
];

const Home = () => {
    const opacity = React.useRef({
        row0: new Animated.Value(1),
        row1: new Animated.Value(1),
        row2: new Animated.Value(1),
        row3: new Animated.Value(1),
        row4: new Animated.Value(1),
        row5: new Animated.Value(1),
        row6: new Animated.Value(1),
        row7: new Animated.Value(1),
    }).current;

    const headerRef = React.useRef<HeaderHandle>();
    const direction = React.useRef('');

    useTVRemoteHandler(({ eventType }) => {
        direction.current = eventType;
    });

    const onFocus = (item: Item) => {
        if (headerRef.current) {
            headerRef.current.onItemFocused(item);
        }
    };

    const onRowBlur = (rowId: 'row0' | 'row1' | 'row2' | 'row3' | 'row4' | 'row5' | 'row6' | 'row7') => {
        if (direction.current === 'down') {
            Animated.timing(opacity[rowId], {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    const onRowFocus = (
        rowId: 'row0' | 'row1' | 'row2' | 'row3' | 'row4' | 'row5' | 'row6' | 'row7',
        rowTitle: string
    ) => {
        Animated.timing(opacity[rowId], {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
        }).start();

        if (headerRef.current) {
            headerRef.current.onRowFocused(rowTitle);
        }
    };

    return (
        <Screen
            style={styles.container}
            focusOptions={{ focusKey: 'home', nextFocusLeft: 'side-menu', verticalViewportOffset: Ratio(130) }}
        >
            <Header headerRef={headerRef} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ marginTop: Ratio(-100) }}
                contentContainerStyle={{ paddingTop: Ratio(100) }}
            >
                <AnimatedView style={{ opacity: opacity.row0 }}>
                    <Row
                        data={mixAndMatch(data1)}
                        onFocus={onFocus}
                        focusOptions={{ forbiddenFocusDirections: ['up'] }}
                        onRowBlur={() => onRowBlur('row0')}
                        onRowFocus={() => onRowFocus('row0', 'Listen again')}
                    />
                    <Text style={styles.categoryTitle}>Quick Picks</Text>
                </AnimatedView>
                <AnimatedView style={{ opacity: opacity.row1 }}>
                    <Row
                        data={mixAndMatch(data2, 15)}
                        onFocus={onFocus}
                        onRowBlur={() => onRowBlur('row1')}
                        onRowFocus={() => onRowFocus('row1', 'Quick Picks')}
                    />
                    <Text style={styles.categoryTitle}>Favorites</Text>
                </AnimatedView>
                <AnimatedView style={{ opacity: opacity.row2 }}>
                    <Row
                        data={mixAndMatch(data1, 5)}
                        onFocus={onFocus}
                        onRowBlur={() => onRowBlur('row2')}
                        onRowFocus={() => onRowFocus('row2', 'Favorites')}
                    />
                    <Text style={styles.categoryTitle}>My playlist #1</Text>
                </AnimatedView>
                <AnimatedView style={{ opacity: opacity.row3 }}>
                    <Row
                        data={mixAndMatch(data2)}
                        onFocus={onFocus}
                        onRowBlur={() => onRowBlur('row3')}
                        onRowFocus={() => onRowFocus('row3', 'My playlist #1')}
                    />
                    <Text style={styles.categoryTitle}>Popular now</Text>
                </AnimatedView>
                <AnimatedView style={{ opacity: opacity.row4 }}>
                    <Row
                        data={mixAndMatch(data1)}
                        onFocus={onFocus}
                        onRowBlur={() => onRowBlur('row4')}
                        onRowFocus={() => onRowFocus('row4', 'Popular now')}
                    />
                    <Text style={styles.categoryTitle}>Favorites</Text>
                </AnimatedView>
                <AnimatedView style={{ opacity: opacity.row5 }}>
                    <Row
                        data={mixAndMatch(data1)}
                        onFocus={onFocus}
                        onRowBlur={() => onRowBlur('row5')}
                        onRowFocus={() => onRowFocus('row5', 'Favorites')}
                    />
                    <Text style={styles.categoryTitle}>My playlist #2</Text>
                </AnimatedView>
                <AnimatedView style={{ opacity: opacity.row6 }}>
                    <Row
                        data={mixAndMatch(data1)}
                        onFocus={onFocus}
                        onRowBlur={() => onRowBlur('row6')}
                        onRowFocus={() => onRowFocus('row6', 'My playlist #2')}
                    />
                    <Text style={styles.categoryTitle}>Liked songs</Text>
                </AnimatedView>
                <AnimatedView style={{ opacity: opacity.row7 }}>
                    <Row
                        data={mixAndMatch(data1)}
                        onFocus={onFocus}
                        onRowBlur={() => onRowBlur('row7')}
                        onRowFocus={() => onRowFocus('row7', 'Liked songs')}
                        focusOptions={{ forbiddenFocusDirections: ['down'] }}
                    />
                </AnimatedView>
            </ScrollView>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
    },
    categoryTitle: {
        fontFamily: 'Inter',
        fontSize: Ratio(48),
        fontWeight: '700',
        color: 'white',
        opacity: 0.5,
        marginTop: Ratio(80),
        left: Ratio(257),
    },
});

export default Home;

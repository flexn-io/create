import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { View, Text, useTVRemoteHandler } from '@flexn/create';
import { platform } from '@rnv/renative';
import Screen from './screen';

const supportedEvents = (): string[] => {
    switch (platform) {
        case 'tizen':
        case 'webos':
            return ['select', 'right', 'left', 'down', 'up', 'playPause', 'back'];
        case 'androidtv':
        case 'firetv':
            return [
                'left',
                'right',
                'up',
                'down',
                'select',
                'space',
                'playPause',
                'back',
                'rewind',
                'fastForward',
                'd',
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                '0',
            ];
        case 'tvos':
            return [
                'select',
                'right',
                'left',
                'down',
                'up',
                'swipeDown',
                'swipeUp',
                'swipeLeft',
                'swipeRight',
                'menu',
                'playPause',
            ];
        default:
            return [];
    }
};

const RemoteHandler = () => {
    const [currentEvent, setCurrentEvent] = useState('');
    const dimensions = useWindowDimensions();

    useTVRemoteHandler(({ eventKeyAction, eventType }) => {
        if (eventKeyAction === 'down') {
            setCurrentEvent(eventType);
        }
    });

    return (
        <Screen style={{ backgroundColor: '#222222' }}>
            <View
                style={{
                    width: dimensions.width,
                    height: dimensions.height,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: 'white', fontSize: 18 }}>
                    Supported events for {platform}: {supportedEvents().join(', ')}
                </Text>
                <Text style={{ color: 'white', marginTop: 20, fontSize: 18 }}>
                    You pressed <Text style={{ color: 'red' }}>{currentEvent}</Text>
                </Text>
            </View>
        </Screen>
    );
};

export default RemoteHandler;

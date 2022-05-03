// separated in case we want to use different player for audio only. rn-video might not be the best choice, i'm not sure
import { Text, View } from '@flexn/sdk';
import React, { useEffect } from 'react';
import { Button } from '@rnv/renative';
import { themeStyles } from '../../../../config';
import { GoogleCast, testProps, useCastSession, useRemoteMediaClient } from '../../../../utils';

const AudioPlayerTest = () => {
    const castClient = useRemoteMediaClient();
    const castSession = useCastSession();

    useEffect(
        () => () => {
            castClient?.stop?.();
        },
        [castClient]
    );

    return (
        <View style={[themeStyles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={themeStyles.textH2}>Player Test 1 (Audio)</Text>
            {castSession && castClient && (
                <Button
                    style={[themeStyles.button, { borderColor: 'coral' }]}
                    textStyle={[themeStyles.buttonText, { color: 'coral' }]}
                    title="Play"
                    onPress={() => {
                        castClient.loadMedia({
                            autoplay: true,
                            mediaInfo: {
                                contentUrl:
                                    'https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/mp4/BigBuckBunny.mp4',
                                contentType: 'video/mp4',
                                metadata: {
                                    albumArtist: 'albumArtist',
                                    albumTitle: 'albumTitle',
                                    artist: 'artist',
                                    composer: 'composer',
                                    discNumber: 1,
                                    trackNumber: 22,
                                    images: [
                                        {
                                            url: 'https://cdn.shopify.com/s/files/1/0057/3728/3618/products/108b520c55e3c9760f77a06110d6a73b_480x.progressive.jpg?v=1573652543',
                                        },
                                    ],
                                    title: 'title',
                                    releaseDate: '2008',
                                    type: 'musicTrack',
                                },
                            },
                            startTime: 10, // seconds
                        });

                        GoogleCast.showExpandedControls();
                    }}
                    {...testProps('flexn-screens-focus-player-play-button')}
                />
            )}
        </View>
    );
};

export default AudioPlayerTest;

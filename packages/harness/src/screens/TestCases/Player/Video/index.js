import { Text, View } from '@flexn/sdk';
import React, { useEffect } from 'react';
import { Button } from 'renative';
import { themeStyles } from '../../../../config';
import { GoogleCast, useCastSession, useRemoteMediaClient } from '../../../../utils';

const VideoPlayerTest = () => {
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
            <Text style={themeStyles.textH2}>Player Test 2 (Video)</Text>
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
                                    images: [
                                        {
                                            url: 'https://cdn.shopify.com/s/files/1/0057/3728/3618/products/108b520c55e3c9760f77a06110d6a73b_480x.progressive.jpg?v=1573652543',
                                        },
                                    ],
                                    title: 'title',
                                    subtitle: 'subtitle subtitle subtitle subtitle',
                                    studio: 'Blender Foundation',
                                    type: 'movie',
                                    releaseDate: '2003',
                                },
                            },
                            startTime: 10, // seconds
                        });

                        GoogleCast.showExpandedControls();
                    }}
                />
            )}
        </View>
    );
};

export default VideoPlayerTest;

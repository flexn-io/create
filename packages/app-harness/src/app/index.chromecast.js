/* eslint-disable no-undef */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { themeStyles } from '../config';
// Media Sample API Values
const ID_REGEX = '/?([^/]+)/?$';
const CONTENT_URL = 'https://storage.googleapis.com/cpe-sample-media/content.json';

const LOG_RECEIVER_TAG = 'Receiver';

function fetchMediaById(id) {
    return new Promise((accept, reject) => {
        fetch(CONTENT_URL)
            .then((response) => response.json())
            .then((obj) => {
                if (obj) {
                    if (obj[id]) {
                        accept(obj[id]);
                    } else {
                        reject(`${id} not found in repository`);
                    }
                } else {
                    reject('Content repository not found.');
                }
            });
    });
}

const App = ({ Component, pageProps }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const load = () => {
            const context = cast.framework.CastReceiverContext.getInstance();
            const playerManager = context.getPlayerManager();
            let castDebugLogger;
            try {
                castDebugLogger = cast.debug.CastDebugLogger.getInstance();
                // Enable debug logger and show a 'DEBUG MODE' overlay at top left corner.
                // castDebugLogger?.setEnabled(true);

                // Show debug overlay
                // castDebugLogger?.showDebugLogs(true);
                // Set verbosity level for Core events.
                castDebugLogger.loggerLevelByEvents = {
                    'cast.framework.events.category.CORE': cast.framework.LoggerLevel.INFO,
                    'cast.framework.events.EventType.MEDIA_STATUS': cast.framework.LoggerLevel.DEBUG,
                    'cast.framework.events.EventType.ERROR': cast.framework.LoggerLevel.ERROR,
                    'cast.framework.events.LoadEvent': cast.framework.LoggerLevel.INFO,
                };

                if (!castDebugLogger.loggerLevelByTags) {
                    castDebugLogger.loggerLevelByTags = {};
                }

                // Set verbosity level for custom tags.
                castDebugLogger.loggerLevelByTags[LOG_RECEIVER_TAG] = cast.framework.LoggerLevel.DEBUG;
            } catch (e) {
                // do nothing. CastDebugLogger only works on registered cast devices
            }

            context.addCustomMessageListener('urn:x-cast:com.flexn.app.harness', ({ data }) => {
                // TODO. Validate this actually works
                router.push({
                    pathname: '/[slug]',
                    query: { slug: data.navigateTo, ...data.state },
                });
                // (data.navigateTo, { state: data.state });
            });

            playerManager.addEventListener(cast.framework.events.EventType.ERROR, (event) => {
                castDebugLogger?.error(LOG_RECEIVER_TAG, `Detailed Error Code - ${event.detailedErrorCode}`, event);
                if (event && event.detailedErrorCode == 905) {
                    castDebugLogger?.error(
                        LOG_RECEIVER_TAG,
                        'LOAD_FAILED: Verify the load request is set up properly and the media is able to play.'
                    );
                }
            });

            playerManager.addEventListener(cast.framework.events.EventType.REQUEST_LOAD, () => {
                setIsPlaying(true);
            });

            playerManager.addEventListener(cast.framework.events.EventType.REQUEST_STOP, () => {
                setIsPlaying(false);
            });

            playerManager.setMessageInterceptor(cast.framework.messages.MessageType.PRECACHE, (loadRequestData) => {
                castDebugLogger?.debug(
                    LOG_RECEIVER_TAG,
                    `PRECACHE loadRequestData: ${JSON.stringify(loadRequestData)}`
                );
                return loadRequestData;
            });

            playerManager.setMessageInterceptor(
                cast.framework.messages.MessageType.PRELOAD,
                async (loadRequestData) => {
                    castDebugLogger?.debug(
                        LOG_RECEIVER_TAG,
                        `PRELOAD loadRequestData: ${JSON.stringify(loadRequestData)}`
                    );
                    return loadRequestData;
                }
            );

            playerManager.setMessageInterceptor(cast.framework.messages.MessageType.LOAD, async (loadRequestData) => {
                castDebugLogger?.debug(LOG_RECEIVER_TAG, `LOAD loadRequestData: ${JSON.stringify(loadRequestData)}`);
                // If the loadRequestData is incomplete return an error message
                if (!loadRequestData || !loadRequestData.media) {
                    const error = new cast.framework.messages.ErrorData(cast.framework.messages.ErrorType.LOAD_FAILED);
                    error.reason = cast.framework.messages.ErrorReason.INVALID_REQUEST;
                    return error;
                }

                // check all content source fields for asset URL or ID
                const source =
                    loadRequestData.media.contentUrl || loadRequestData.media.entity || loadRequestData.media.contentId;

                // If there is no source or a malformed ID then return an error.
                if (!source || source == '' || !source.match(ID_REGEX)) {
                    const error = new cast.framework.messages.ErrorData(cast.framework.messages.ErrorType.LOAD_FAILED);
                    error.reason = cast.framework.messages.ErrorReason.INVALID_REQUEST;
                    return error;
                }

                const sourceId = source.match(ID_REGEX)?.[1];
                if (sourceId?.includes('.')) {
                    castDebugLogger?.debug(LOG_RECEIVER_TAG, 'Interceptor received full URL');
                    loadRequestData.media.contentUrl = source;
                    return loadRequestData;
                }
                castDebugLogger?.debug(LOG_RECEIVER_TAG, 'Interceptor received ID');
                return fetchMediaById(sourceId).then((item) => {
                    const metadata = new cast.framework.messages.GenericMediaMetadata();
                    metadata.title = item.title;
                    metadata.subtitle = item.description;
                    loadRequestData.media.contentId = item.stream.dash;
                    loadRequestData.media.contentType = 'application/dash+xml';
                    loadRequestData.media.metadata = metadata;
                    return loadRequestData;
                });
            });
            const playbackConfig = new cast.framework.PlaybackConfig();
            playbackConfig.autoResumeDuration = 5;
            castDebugLogger?.info(LOG_RECEIVER_TAG, `autoResumeDuration set to: ${playbackConfig.autoResumeDuration}`);

            context.start({ playbackConfig });
        };

        load();
    }, []);

    return (
        <>
            <View style={themeStyles.app}>
                <View style={themeStyles.appContainer}>
                    <Component {...pageProps} />
                </View>
            </View>
            <div style={{ opacity: isPlaying ? 1 : 0 }}>
                <cast-media-player />;
            </div>
        </>
    );
};

export default App;

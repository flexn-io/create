import { Image, Pressable } from '@flexn/sdk';
import React, { useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { Ratio } from '../../utils';
import { useTheme, ThemeInterface } from '../../context/themeContext';

const TIMEOUT_MS = 1000;
const Packshot = ({ item, onFocus, onPress, data, repeatContext }) => {
    const { theme } = useTheme();
    const styles = getStyles(theme);
    const playerRef = useRef();
    const [playVideo, setPlayVideo] = useState(false);
    const timeout = useRef<NodeJS.Timeout>();

    return (
        <Pressable
            style={[styles.recyclerItem, { width: item.width, height: item.height }]}
            repeatContext={repeatContext}
            onFocus={() => {
                timeout.current = setTimeout(() => {
                    setPlayVideo(true);
                }, TIMEOUT_MS);
                onFocus?.(data);
            }}
            onBlur={() => {
                if (timeout.current) {
                    clearTimeout(timeout.current);
                }
                setPlayVideo(false);
            }}
            onPress={() => onPress?.(data)}
            focusOptions={{
                animatorOptions: {
                    type: 'scale_with_border',
                    scale: 1.1,
                },
            }}
        >
            {playVideo ? (
                <Video
                    source={{
                        uri: 'https://cdn.videvo.net/videvo_files/video/free/2014-08/large_watermarked/Earth_Zoom_In_preview.mp4',
                    }}
                    ref={playerRef}
                    style={{ width: item.width - 4, height: item.height, position: 'absolute' }}
                />
            ) : (
                <Image resizeMode="cover" source={{ uri: data.posterImageUrl }} style={styles.poster} />
            )}
        </Pressable>
    );
};

const getStyles = (theme: ThemeInterface) =>
    StyleSheet.create({
        recyclerItem: {
            borderRadius: theme.carouselBorderRadius,
            marginTop: Ratio(25),
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            borderWidth: 2,
            borderColor: theme.carouselBorderColor,
        },
        poster: {
            width: '100%',
            height: '100%',
            borderRadius: theme.carouselBorderRadius,
        },
    });

export default Packshot;

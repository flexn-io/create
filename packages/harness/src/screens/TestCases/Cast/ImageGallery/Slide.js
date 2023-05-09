import { Image, TouchableOpacity, Text, View } from '@flexn/create';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { ParallaxImage } from 'react-native-snap-carousel';
import { isPlatformIos } from '@rnv/renative';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const slideHeight = viewportHeight * 0.36;
const entryBorderRadius = 8;
const slideWidth = Math.round((75 * viewportWidth) / 100);
const itemHorizontalMargin = Math.round((2 * viewportWidth) / 100);
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

export const Slide = ({ data: { illustration, title, subtitle }, parallax, parallaxProps, even }) => {
    const uppercaseTitle = title && (
        <Text
            style={[
                {
                    color: 'black',
                    fontSize: 13,
                    fontWeight: 'bold',
                    letterSpacing: 0.5,
                },
                even ? { color: 'white' } : {},
            ]}
            numberOfLines={2}
        >
            {title.toUpperCase()}
        </Text>
    );

    return (
        <TouchableOpacity
            activeOpacity={1}
            style={{
                width: itemWidth,
                height: slideHeight,
                paddingHorizontal: itemHorizontalMargin,
                paddingBottom: 18,
            }}
            onPress={() => {
                alert(`You've clicked '${title}'`);
            }}
        >
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: itemHorizontalMargin,
                    right: itemHorizontalMargin,
                    bottom: 18,
                    shadowColor: 'black',
                    shadowOpacity: 0.25,
                    shadowOffset: { width: 0, height: 10 },
                    shadowRadius: 10,
                    borderRadius: entryBorderRadius,
                }}
            />
            <View
                style={[
                    {
                        flex: 1,
                        marginBottom: isPlatformIos ? 0 : -1, // Prevent a random Android rendering issue
                        backgroundColor: 'white',
                        borderTopLeftRadius: entryBorderRadius,
                        borderTopRightRadius: entryBorderRadius,
                    },
                    even ? { backgroundColor: 'black' } : {},
                ]}
            >
                {parallax ? (
                    <ParallaxImage
                        source={{ uri: illustration }}
                        containerStyle={[
                            {
                                flex: 1,
                                marginBottom: isPlatformIos ? 0 : -1, // Prevent a random Android rendering issue
                                backgroundColor: 'white',
                                borderTopLeftRadius: entryBorderRadius,
                                borderTopRightRadius: entryBorderRadius,
                            },
                            even ? { backgroundColor: 'black' } : {},
                        ]}
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            resizeMode: 'cover',
                            borderRadius: isPlatformIos ? entryBorderRadius : 0,
                            borderTopLeftRadius: entryBorderRadius,
                            borderTopRightRadius: entryBorderRadius,
                        }}
                        parallaxFactor={0.35}
                        showSpinner
                        spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
                        {...parallaxProps}
                    />
                ) : (
                    <Image
                        source={{ uri: illustration }}
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            resizeMode: 'cover',
                            borderRadius: isPlatformIos ? entryBorderRadius : 0,
                            borderTopLeftRadius: entryBorderRadius,
                            borderTopRightRadius: entryBorderRadius,
                        }}
                    />
                )}
                <View
                    style={[
                        {
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: entryBorderRadius,
                            backgroundColor: 'white',
                        },
                        even ? { backgroundColor: 'black' } : {},
                    ]}
                />
            </View>
            <View
                style={[
                    {
                        justifyContent: 'center',
                        paddingTop: 20 - entryBorderRadius,
                        paddingBottom: 20,
                        paddingHorizontal: 16,
                        backgroundColor: 'white',
                        borderBottomLeftRadius: entryBorderRadius,
                        borderBottomRightRadius: entryBorderRadius,
                    },
                    even ? { backgroundColor: 'black' } : {},
                ]}
            >
                {uppercaseTitle}
                <Text
                    style={[
                        { marginTop: 6, color: 'gray', fontSize: 12, fontStyle: 'italic' },
                        even ? { color: 'rgba(255, 255, 255, 0.7)' } : {},
                    ]}
                    numberOfLines={2}
                >
                    {subtitle}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

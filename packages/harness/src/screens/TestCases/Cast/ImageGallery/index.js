import { Text, View } from '@flexn/create';
import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { themeStyles } from '../../../../config';
import { useRemoteMediaClient } from '../../../../utils/libs/react-native-google-cast';
import { ENTRIES1 } from './data';
import { Slide } from './Slide';

const { width: viewportWidth } = Dimensions.get('window');

const slideWidth = Math.round((75 * viewportWidth) / 100);
const itemHorizontalMargin = Math.round((2 * viewportWidth) / 100);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const ImageGalleryCastTest = () => {
    const castClient = useRemoteMediaClient();

    useEffect(
        () => () => {
            castClient?.stop?.();
        },
        [castClient]
    );

    const renderItemWithParallax = ({ item, index }, parallaxProps) => (
        <Slide data={item} even={(index + 1) % 2 === 0} parallax parallaxProps={parallaxProps} />
    );

    return (
        <View style={[themeStyles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={themeStyles.textH2}> Cast Test 1 (Image Gallery) </Text>
            <Carousel
                data={ENTRIES1}
                renderItem={renderItemWithParallax}
                sliderWidth={viewportWidth}
                itemWidth={slideWidth + itemHorizontalMargin * 2}
                hasParallaxImages
                firstItem={1}
                inactiveSlideScale={0.94}
                inactiveSlideOpacity={0.7}
                // inactiveSlideShift={20}
                containerCustomStyle={{
                    marginTop: 15,
                    overflow: 'visible',
                }}
                contentContainerCustomStyle={{
                    paddingVertical: 10,
                }}
                loop
                loopClonesPerSide={2}
                onSnapToItem={(index) => {
                    castClient?.loadMedia?.({
                        autoplay: true,
                        mediaInfo: {
                            contentUrl: ENTRIES1[index].illustration,
                            metadata: {
                                images: [
                                    {
                                        url: 'https://cdn.shopify.com/s/files/1/0057/3728/3618/products/108b520c55e3c9760f77a06110d6a73b_480x.progressive.jpg?v=1573652543',
                                    },
                                ],
                                title: 'title',
                                artist: 'artist',
                                creationDate: '2005',
                                type: 'photo',
                            },
                        },
                    });
                }}
            />
        </View>
    );
};

export default ImageGalleryCastTest;

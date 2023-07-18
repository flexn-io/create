import { View, Text, useTVRemoteHandler } from '@flexn/create';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Ratio } from '../../utils';

type TestDescriptionProps = {
    id: string;
    title?: string;
    description: string;
};

const TestDescription = ({ id, title, description }: TestDescriptionProps) => {
    const [visible] = useState(true);

    useTVRemoteHandler(({ eventType, eventKeyAction }) => {
        console.log({ eventType, eventKeyAction });
    });

    if (visible) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{`#${id} ${title ?? ''}`}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        );
    }

    return null;
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: Ratio(50),
        marginBottom: Ratio(50),
    },
    title: {
        color: '#FFFFFF',
        fontSize: Ratio(26),
    },
    description: {
        marginTop: 10,
        color: '#FFFFFF',
        fontSize: Ratio(20),
        width: '70%',
        textAlign: 'center',
    },
});

export { TestDescription };

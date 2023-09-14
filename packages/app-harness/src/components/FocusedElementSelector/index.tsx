import { StyleSheet } from 'react-native';
import { View, Text } from '@flexn/create';
import React from 'react';
import { useDebugContext } from '../../context/debugContext';
import { Ratio } from '../../utils';

const FocusedElementSelector = () => {
    const { focusedElementId } = useDebugContext();

    if (focusedElementId) {
        return (
            <View style={styles.container}>
                <Text
                    testID="focused-element-selector"
                    accessibilityLabel="focused-element-selector"
                    accessible={true}
                    style={styles.title}
                >
                    {focusedElementId}
                </Text>
            </View>
        );
    }

    return null;
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: Ratio(0),
        marginBottom: Ratio(0),
    },
    title: {
        color: '#FFFFFF',
        fontSize: Ratio(10),
    },
});

export { FocusedElementSelector };

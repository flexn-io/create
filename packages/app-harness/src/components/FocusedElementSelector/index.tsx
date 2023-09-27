import { StyleSheet } from 'react-native';
import { View, Text } from '@flexn/create';
import React from 'react';
import { useDebugContext } from '../../context/debugContext';
import { Ratio, testProps } from '../../utils';

const FocusedElementSelector = () => {
    const { focusedElementId, additionalTextInfo } = useDebugContext();

    if (focusedElementId) {
        return (
            <View style={styles.container}>
                <Text {...testProps('focused-element-selector')} style={styles.title}>
                    {focusedElementId}
                </Text>
                {additionalTextInfo[0] !== '' && (
                    <View style={{ flexDirection: 'row' }}>
                        <Text {...testProps('additional-text-info-selector-0')} style={styles.title}>
                            {additionalTextInfo[0]}
                        </Text>
                        <Text>{` `}</Text>
                        {additionalTextInfo[1] !== '' && (
                            <Text {...testProps('additional-text-info-selector-1')} style={styles.title}>
                                {additionalTextInfo[1]}
                            </Text>
                        )}
                        <Text>{` `}</Text>
                        {additionalTextInfo[2] !== '' && (
                            <Text {...testProps('additional-text-info-selector-2')} style={styles.title}>
                                {additionalTextInfo[2]}
                            </Text>
                        )}
                    </View>
                )}
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

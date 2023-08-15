import { useEffect } from 'react';
import { InteractionManager } from 'react-native';
import CoreManager from '../focusManager/service/core';
import Event, { EVENT_TYPES } from '../focusManager/events';
import FocusModel from '../focusManager/model/abstractFocusModel';

export default function useOnLayout(model: FocusModel | null, callback?: (() => void) | (() => Promise<void>)) {
    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            sendOnLayoutEvent();
        });
    }, []);

    const onLayout = () => {
        sendOnLayoutEvent();
    };

    const sendOnLayoutEvent = () => {
        if (model) {
            CoreManager.setPendingLayoutMeasurement(model, () => {
                Event.emit(model.getType(), model.getId(), EVENT_TYPES.ON_LAYOUT);
                callback?.();
            });
        } else {
            callback?.();
        }
    };

    return {
        onLayout,
    };
}

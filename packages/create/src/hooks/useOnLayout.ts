import { useEffect } from 'react';
import { InteractionManager, LayoutChangeEvent } from 'react-native';
import CoreManager from '../focusManager/service/core';
import Event, { EVENT_TYPES } from '../focusManager/events';
import FocusModel from '../focusManager/model/abstractFocusModel';

export default function useOnLayout(
    model: FocusModel | null,
    callback?: ((event: LayoutChangeEvent) => void) | (() => Promise<void>)
) {
    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            sendOnLayoutEvent();
        });
    }, []);

    const onLayout = (event: LayoutChangeEvent) => {
        sendOnLayoutEvent(event);
    };

    const sendOnLayoutEvent = (event?: LayoutChangeEvent) => {
        if (model) {
            CoreManager.setPendingLayoutMeasurement(model, () => {
                Event.emit(model.getType(), model.getId(), EVENT_TYPES.ON_LAYOUT);
                callback?.(event as LayoutChangeEvent);
            });
        } else {
            callback?.(event as LayoutChangeEvent);
        }
    };

    return {
        onLayout,
    };
}

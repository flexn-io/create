import { useEffect } from 'react';
import { InteractionManager, LayoutChangeEvent } from 'react-native';
import CoreManager from '../focusManager/service/core';
import Event, { EVENT_TYPES } from '../focusManager/events';
import FocusModel from '../focusManager/model/abstractFocusModel';

export default function useOnLayout(
    model: FocusModel | null,
    callback?: (() => void) | (() => Promise<void>),
    onLayoutFromComponent?: (event: LayoutChangeEvent) => void
) {
    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            sendOnLayoutEvent();
        });
    }, []);

    const onLayout = (event: LayoutChangeEvent) => {
        if (onLayoutFromComponent) {
            onLayoutFromComponent(event);
        }
        sendOnLayoutEvent();
    };

    const sendOnLayoutEvent = () => {
        if (model) {
            CoreManager.setPendingLayoutMeasurement(model, () => {
                Event.emit(
                    model.getType(),
                    model.getId(),
                    EVENT_TYPES.ON_LAYOUT
                );
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

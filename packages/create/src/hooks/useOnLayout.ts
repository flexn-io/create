import { useEffect, useRef } from 'react';
import { InteractionManager } from 'react-native';
import Event, { EVENT_TYPES } from '../focusManager/events';
import FocusModel from '../focusManager/model/abstractFocusModel';

import { CoreManager } from '..';

export default function useOnLayout(
    model: FocusModel | null,
    callback?: (() => void) | (() => Promise<void>),
    modelIsParent = false
) {
    const interactionPromise = useRef<Promise<any>>();
    const pendingCallbacks = useRef<{ (): void | Promise<void> }[]>([]).current;

    useEffect(() => {
        interactionPromise.current = InteractionManager.runAfterInteractions(() => {
            if (pendingCallbacks.length) {
                for (let index = 0; index < pendingCallbacks.length; index++) {
                    pendingCallbacks[index]();
                }
                pendingCallbacks.splice(0, pendingCallbacks.length);
            }

            return true;
        }).then(() => Promise.resolve());
    }, []);

    const onLayout = () => {
        if (interactionPromise.current) {
            interactionPromise.current.then(() => {
                if (model) {
                    CoreManager.setPendingLayoutMeasurement(model, () => {
                        if (!modelIsParent) {
                            Event.emit(model.getType(), model.getId(), EVENT_TYPES.ON_LAYOUT);
                        }
                        callback?.();
                    });
                } else {
                    callback?.();
                }
            });
        } else {
            if (callback) pendingCallbacks.push(callback);
        }
    };

    return {
        onLayout,
    };
}

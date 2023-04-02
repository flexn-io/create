import { useEffect } from 'react';
import { AbstractFocusModel } from '../focusManager/types';
import Event, { EVENT_TYPES } from '../focusManager/events';

export default function useOnComponentLifeCycle({
    model,
    measured,
}: {
    model: AbstractFocusModel;
    measured?: boolean;
}) {
    useEffect(() => {
        if (measured) {
            Event.emit(model, EVENT_TYPES.ON_MOUNT_AND_MEASURED);
        }
    }, [measured]);

    useEffect(() => {
        Event.emit(model, EVENT_TYPES.ON_MOUNT);

        return () => {
            Event.emit(model, EVENT_TYPES.ON_UNMOUNT);
        };
    }, []);
}

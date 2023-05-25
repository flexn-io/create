import { useEffect } from 'react';
import Event, { EVENT_TYPES } from '../focusManager/events';
import FocusModel from '../focusManager/model/FocusModel';

export default function useOnComponentLifeCycle({ model, measured }: { model: FocusModel; measured?: boolean }) {
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

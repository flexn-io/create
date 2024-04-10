export const EVENT_TYPES = {
    ON_MOUNT: 'onMount',
    ON_MOUNT_AND_MEASURED: 'onMountAndMeasured',
    ON_UNMOUNT: 'onUnMount',
    ON_LAYOUT: 'onLayout',
    ON_LAYOUT_MEASURE_COMPLETED: 'onLayoutMeasureCompleted',
    ON_CELL_CONTAINER_FOCUS: 'onCellContainerFocus',
    ON_CELL_CONTAINER_BLUR: 'onCellContainerBlur',
};

const events: {
    [key: string]: {
        [key: string]: {
            [key: string]: { [key: string]: (...args: any) => void };
        };
    };
} = {};

class Event {
    static subscribe(
        callerType: string,
        callerId: string,
        eventName: string,
        cb: (...args: any) => void
    ) {
        if (!eventName) throw 'Event name cannot be empty or null';
        if (!cb) throw 'A callback must be registered for subscription';

        const uuid = Event._generateGuid();

        if (!events[callerType]) {
            events[callerType] = {};
        }

        if (!events[callerType][callerId]) {
            events[callerType][callerId] = {};
        }

        if (!events[callerType][callerId][eventName]) {
            events[callerType][callerId][eventName] = {};
        }

        events[callerType][callerId][eventName][uuid] = cb;

        return () => Event._unsubscribe(callerType, callerId, eventName, uuid);
    }

    static _generateGuid() {
        const s4 = () =>
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);

        return (
            s4() +
            s4() +
            '-' +
            s4() +
            '-' +
            s4() +
            '-' +
            s4() +
            '-' +
            s4() +
            s4() +
            s4()
        );
    }

    static emit(
        callerType: string,
        callerId: string,
        eventName: string,
        data = {}
    ) {
        if (!eventName) throw 'An event name is required for emission.';
        // The callbacks for eventName are registered listener Id keys under events[eventName]
        const registeredListeners = events[callerType]?.[callerId]?.[eventName];

        try {
            for (const uuid of Object.keys(registeredListeners)) {
                registeredListeners[uuid](data);
            }
        } catch (x) {
            // errors when no listeners are initialized, safe to ignore
        }

        return true;
    }

    static _unsubscribe(
        callerType: string,
        callerId: string,
        eventName: string,
        uuid: string
    ) {
        delete events[callerType]?.[callerId]?.[eventName]?.[uuid];
    }

    static destroy(callerType: string, callerId: string) {
        delete events[callerType][callerId];
    }
}

export default Event;

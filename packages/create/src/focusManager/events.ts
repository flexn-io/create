import FocusModel from './model/abstractFocusModel';

export const EVENT_TYPES = {
    ON_PROPERTY_CHANGED: 'onPropertyChanged',
    ON_MOUNT: 'onMount',
    ON_MOUNT_AND_MEASURED: 'onMountAndMeasured',
    ON_UNMOUNT: 'onUnMount',
    ON_LAYOUT: 'onLayout',
    ON_LAYOUT_MEASURE_COMPLETED: 'onLayoutMeasureCompleted',
    ON_CELL_CONTAINER_FOCUS: 'onCellContainerFocus',
    ON_CELL_CONTAINER_BLUR: 'onCellContainerBlur',
};

const events: { [key: string]: { [key: string]: { [key: string]: { [key: string]: (...args: any) => void } } } } = {};

class Event {
    static subscribe(instance: FocusModel, eventName: string, cb: (...args: any) => void) {
        if (!eventName) throw 'Event name cannot be empty or null';
        if (!cb) throw 'A callback must be registered for subscription';

        const uuid = Event._generateGuid();

        if (!events[instance.getType()]) {
            events[instance.getType()] = {};
        }

        if (!events[instance.getType()][instance.getId()]) {
            events[instance.getType()][instance.getId()] = {};
        }

        if (!events[instance.getType()][instance.getId()][eventName]) {
            events[instance.getType()][instance.getId()][eventName] = {};
        }

        events[instance.getType()][instance.getId()][eventName][uuid] = cb;

        return () => Event._unsubscribe(instance, eventName, uuid);
    }

    static _generateGuid() {
        const s4 = () =>
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    static emit(instance: FocusModel, eventName: string, data = {}) {
        if (!eventName) throw 'An event name is required for emission.';
        // The callbacks for eventName are registered listener Id keys under events[eventName]
        const registeredListeners = events[instance.getType()]?.[instance.getId()]?.[eventName];

        try {
            for (const uuid of Object.keys(registeredListeners)) {
                registeredListeners[uuid](data);
            }
        } catch (x) {
            // errors when no listeners are initialized, safe to ignore
        }

        return true;
    }

    static _unsubscribe(instance: FocusModel, eventName: string, uuid: string) {
        delete events[instance.getType()]?.[instance.getId()]?.[eventName]?.[uuid];
    }

    static destroy(instance: FocusModel) {
        delete events[instance.getType()][instance.getId()];
    }
}

export default Event;

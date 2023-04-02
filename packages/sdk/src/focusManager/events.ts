import FocusModel from './model/AbstractFocusModel';

export const EVENT_TYPES = {
    ON_PROPERTY_CHANGED: 'onPropertyChanged',
    ON_MOUNT: 'onMount',
    ON_MOUNT_AND_MEASURED: 'onMountAndMeasured',
    ON_UNMOUNT: 'onUnMount',
    ON_LAYOUT: 'onLayout',
};
const events: any = {};

class Event {
    /**
     * Listener for an event.
     *
     * @static
     * @param {string} eventName - which event name to listen to
     * @param {function} cb - When the event is emitted, the function to call
     * @returns {function} - the unsubscribe function
     */
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

    /**
     * Create a random pseudo-unique string to identify each listener.
     *
     * @static
     * @returns {string}
     */
    static _generateGuid() {
        const s4 = () =>
            Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    /**
     * Emit an event.
     *
     * @static
     * @param {string} eventName Name of event to be emitted.
     * @param {Object} data={} Optional data to be provided by the eventj
     * @returns {boolean} indication if the emission worked
     */
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

    /**
     * Unsubscribe an event listener from an event.
     *
     * @static
     * @param {string} eventName - the event to unsub from
     * @param {string} uuid - the single listener to be unsubbed
     */
    static _unsubscribe(instance: FocusModel, eventName: string, uuid: string) {
        delete events[instance.getType()]?.[instance.getId()]?.[eventName]?.[uuid];
    }

    /**
     * Remove the event and all registered listeners.
     *
     * @static
     * @param {String} eventName - event name to destroy
     */
    static destroy(instance: FocusModel) {
        delete events[instance.getType()][instance.getId()];
    }
}

export default Event;

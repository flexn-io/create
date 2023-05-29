import AbstractFocusModel from './FocusModel';
import Event, { EVENT_TYPES } from '../events';
import { CoreManager } from '../..';
import FocusModel from './FocusModel';

type ViewGroupModelParams = {
    focusKey?: string;
    group: string;
    parent: FocusModel;
};

class ViewGroup extends AbstractFocusModel {
    private _group: string;
    private _focusKey?: string;

    constructor(params: ViewGroupModelParams) {
        super(params);

        const { parent, group, focusKey } = params;

        const id = CoreManager.generateID(8);
        this._id = parent?.getId() ? `${parent.getId()}:viewGroup-${id}` : `viewGroup-${id}`;
        this._parent = parent;
        this._type = 'viewGroup';
        this._group = group;
        this._focusKey = focusKey;

        this._onMount = this._onMount.bind(this);
        this._onUnmount = this._onUnmount.bind(this);
        this._onLayout = this._onLayout.bind(this);

        this._events = [
            Event.subscribe(this, EVENT_TYPES.ON_MOUNT, this._onMount),
            Event.subscribe(this, EVENT_TYPES.ON_UNMOUNT, this._onUnmount),
            Event.subscribe(this, EVENT_TYPES.ON_LAYOUT, this._onLayout),
        ];
    }

    // EVENTS
    private _onMount() {
        CoreManager.registerFocusAwareComponent(this);
    }

    private _onUnmount() {
        CoreManager.removeFocusAwareComponent(this);
        this.unsubscribeEvents();
    }

    private async _onLayout() {
        // await measureAsync({ model: this });
        this.remeasureChildrenLayouts(this);
    }

    // END EVENTS

    public getGroup() {
        return this._group;
    }

    public getFocusKey() {
        return this._focusKey;
    }
}

export default ViewGroup;

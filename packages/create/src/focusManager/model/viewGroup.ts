import { View } from 'react-native';
import FocusModel from './abstractFocusModel';
import Event, { EVENT_TYPES } from '../events';
import { CoreManager } from '../..';
import { MutableRefObject } from 'react';
import { ViewGroupProps } from '../types';

class ViewGroup extends FocusModel {
    private _group: string;
    private _focusKey?: string;

    constructor(params: Omit<ViewGroupProps & ViewGroupProps['focusOptions'], 'ref' | 'focusOptions'>) {
        super(params);

        const { focusContext, group, focusKey } = params;

        const id = CoreManager.generateID(8);
        this._id = focusContext?.getId() ? `${focusContext.getId()}:viewGroup-${id}` : `viewGroup-${id}`;
        this._parent = focusContext;
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

    public getNode(): MutableRefObject<View> {
        return this.node;
    }
}

export default ViewGroup;

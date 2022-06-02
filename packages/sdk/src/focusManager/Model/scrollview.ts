import { Context } from '../types';
import { makeid } from '../helpers';
import AbstractFocusModel from './AbstractFocusModel';

class ScrollView extends AbstractFocusModel {
    public context: any;

    constructor(params: any) {
        super();
        this.context = {};
        this.createContext(params);
    }

    private createContext(params: any) {
        this.context = {
            id: `scroll-${makeid(8)}`,
            children: [],
            isFocusable: false,
            isScrollable: true,
            scrollOffsetX: 0,
            scrollOffsetY: 0,
            type: 'scrollView',
            ...params
        };

        this.type = 'scrollView';
    };

    public updateContext(params: any) {
        this.createContext(params);
    }

    public getContext() {
        return this.context;
    }
};

const ScrollViewInstances: { [key: string]: ScrollView; } = {};
function createOrReturnInstance(context: any) {
    if (ScrollViewInstances[context.id]) {
        return ScrollViewInstances[context.id];
    }

    const _ScrollView = new ScrollView(context);
    ScrollViewInstances[_ScrollView.context.id] = _ScrollView;

    return ScrollViewInstances[_ScrollView.context.id];
};

function destroyInstance(context: Context) {
    if (ScrollViewInstances[context.id]) {
        delete ScrollViewInstances[context.id];
    }
}

export type ScrollViewCls = ScrollView;


export { createOrReturnInstance, destroyInstance };
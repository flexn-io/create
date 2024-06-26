import { MutableRefObject } from 'react';
import { Platform, View as RNView } from 'react-native';
import Event, { EVENT_TYPES } from '../events';
import { measureAsync } from '../layoutManager';
import CoreManager from '../service/core';
import { PressableProps } from '../types';
import FocusModel, { MODEL_TYPES } from './abstractFocusModel';
import Grid from './grid';
import Recycler from './recycler';
import Row from './row';
import ScrollView from './scrollview';
import ViewGroup from './viewGroup';

export const ANIMATION_TYPES = {
    BORDER: 'border',
    SCALE: 'scale',
    SCALE_BORDER: 'scale_with_border',
    BACKGROUND: 'background',
};

class View extends FocusModel {
    private _parentRecyclerView?: Recycler;
    private _parentScrollView?: ScrollView;

    private _isFocused: boolean;
    private _focusKey?: string;
    private _hasPreferredFocus: boolean;
    private _verticalContentContainerGap = 0;
    private _horizontalContentContainerGap = 0;
    private _repeatContext:
        | {
              focusContext: FocusModel;
              index: number;
          }
        | undefined;

    private _onPress?: () => void;
    private _onLongPress?: () => void;

    private _pendingEvents = {
        _onFocus: false,
        _onBlur: false,
    };

    constructor(
        params: Omit<
            PressableProps & PressableProps['focusOptions'],
            'style' | 'focusOptions' | 'className'
        > & {
            verticalContentContainerGap?: number;
            horizontalContentContainerGap?: number;
        }
    ) {
        super(params);

        const {
            focusRepeatContext,
            focusContext,
            forbiddenFocusDirections = [],
            onFocus,
            onBlur,
            onPress,
            focusKey,
            hasPreferredFocus = false,
            verticalContentContainerGap = 0,
            horizontalContentContainerGap = 0,
        } = params;

        const id = CoreManager.generateID(8);
        this._id = focusContext?.getId()
            ? `${focusContext.getId()}:view-${id}`
            : `view-${id}`;
        this._type = 'view';
        this._parent = focusContext;
        this._isFocused = false;
        this._isFocusable = true;
        this._repeatContext = focusRepeatContext;
        this._focusKey = focusKey;
        this._forbiddenFocusDirections = forbiddenFocusDirections;
        this._hasPreferredFocus = hasPreferredFocus;
        this._verticalContentContainerGap = verticalContentContainerGap;
        this._horizontalContentContainerGap = horizontalContentContainerGap;

        this._onFocus = onFocus;
        this._onBlur = onBlur;
        this._onPress = onPress;

        this._onMount = this._onMount.bind(this);
        this._onUnmount = this._onUnmount.bind(this);
        this._onLayout = this._onLayout.bind(this);

        this._events = [
            Event.subscribe(
                this.getType(),
                this.getId(),
                EVENT_TYPES.ON_MOUNT,
                this._onMount
            ),
            Event.subscribe(
                this.getType(),
                this.getId(),
                EVENT_TYPES.ON_UNMOUNT,
                this._onUnmount
            ),
            Event.subscribe(
                this.getType(),
                this.getId(),
                EVENT_TYPES.ON_LAYOUT,
                this._onLayout
            ),
        ];

        this.init();
    }

    private init() {
        if (this.getParent()?.getType() === MODEL_TYPES.RECYCLER) {
            const parent = this.getParent() as Recycler;
            if (
                parent.getInitialRenderIndex() &&
                parent.getInitialRenderIndex() ===
                    this.getRepeatContext()?.index
            ) {
                parent.setFocusedView(this);
            } else if (
                !parent.getFocusedView() &&
                this.getRepeatContext()?.index === 0
            ) {
                parent.setFocusedView(this);
            }
        }
    }

    // EVENTS
    private _onMount() {
        CoreManager.registerFocusAwareComponent(this);
        const screen = this.getScreen();
        if (screen) {
            screen.addComponentToPendingLayoutMap(this.getId());
            if (
                this.hasPreferredFocus() &&
                !this.getScreen()?.isInitialFocusIgnored()
            ) {
                screen.setPreferredFocus(this);
                CoreManager.executeFocus(this);
            }
        }
    }

    private _onUnmount() {
        const wasCurrentFocusedView =
            CoreManager.getCurrentFocus()?.getId() === this.getId();
        CoreManager.removeFocusAwareComponent(this);
        this.getScreen()?.onViewRemoved(this, wasCurrentFocusedView);
        if (
            this.getParent() instanceof Row ||
            this.getParent() instanceof Grid
        ) {
            const parent = this.getParent() as Recycler;
            if (parent.getFocusedView()?.getId() === this.getId()) {
                parent.setFocusedView(null);
                parent.setFocusedIndex(-1);
            }
        }
        this.unsubscribeEvents();
    }

    private async _onLayout() {
        await measureAsync({ model: this });
        await this.getScreen()?.removeComponentFromPendingLayoutMap(
            this.getId()
        );
        
        if (
            !this.getScreen()?.isInitialFocusIgnored() &&
            !this.getScreen()?.isInitialLoadInProgress() &&
            (!CoreManager.getCurrentFocus() ||
                CoreManager.getCurrentFocus()?.isInBackground())
        ) {
            CoreManager.executeFocus(
                await this.getScreen()!.getFirstFocusableOnScreen()
            );
        }
    }

    // END EVENTS

    public onBlur(): void {
        const parent = this.getParent();

        if (this._onBlur && this.getNode().current) {
            if (Platform.OS === 'web') {
                setTimeout(() => {
                    this._onBlur?.();
                }, 1);
            } else {
                this._onBlur();
            }
        } else {
            this._pendingEvents['_onBlur'] = true;
        }

        if (parent instanceof Row || parent instanceof Grid) {
            Event.emit(
                parent.getType(),
                parent.getId(),
                EVENT_TYPES.ON_CELL_CONTAINER_BLUR,
                this.getRepeatContext()?.index
            );
        }
    }

    public onFocus(): void {
        const parent = this.getParent();

        if (this._onFocus && this.getNode().current) {
            if (Platform.OS === 'web') {
                setTimeout(() => {
                    this._onFocus?.();
                }, 1);
            } else {
                this._onFocus();
            }
        } else {
            this._pendingEvents['_onFocus'] = true;
        }

        if (parent instanceof Row) {
            parent.setFocusedView(this);
        }

        if (parent instanceof Row || parent instanceof Grid) {
            Event.emit(
                parent.getType(),
                parent.getId(),
                EVENT_TYPES.ON_CELL_CONTAINER_FOCUS,
                this.getRepeatContext()?.index
            );
        }
    }

    public isFocusable(): boolean {
        return true;
    }

    public updateEvents({
        onPress,
        onFocus,
        onBlur,
        onLongPress,
    }: {
        onPress?(): void;
        onFocus?(): void;
        onBlur?(): void;
        onLongPress?(): void;
    }) {
        this._onPress = onPress;
        this._onFocus = onFocus;
        this._onBlur = onBlur;
        this._onLongPress = onLongPress;

        if (this._onFocus && this._pendingEvents['_onFocus']) {
            this._onFocus();
            this._pendingEvents['_onFocus'] = false;
        }
        if (this._onBlur && this._pendingEvents['_onBlur']) {
            this._onBlur();
            this._pendingEvents['_onBlur'] = false;
        }
        return this;
    }

    public onPress(): void {
        if (this._onPress && this.getNode().current) {
            this._onPress();
        }
    }

    public onLongPress(): void {
        if (this._onLongPress && this.getNode().current) {
            this._onLongPress();
        }
    }

    public setIsFocused(value: boolean): this {
        this._isFocused = value;

        if (value && this.getParent()?.getType() === MODEL_TYPES.RECYCLER) {
            const currentIndex = this.getRepeatContext()?.index;
            if (currentIndex !== undefined) {
                (this.getParent() as Recycler)
                    .setFocusedIndex(currentIndex)
                    .setFocusedView(this);
            }
        }

        if (value) {
            let parent = this.getParent();
            while (parent) {
                if (parent instanceof ViewGroup) {
                    parent.setCurrentFocus(this);
                    break;
                }
                parent = parent?.getParent();
            }
        }

        return this;
    }

    public getIsFocused(): boolean {
        return this._isFocused;
    }

    public setRepeatContext(value: {
        focusContext: FocusModel;
        index: number;
    }): this {
        this._repeatContext = value;

        return this;
    }

    public getRepeatContext():
        | { focusContext: FocusModel; index: number }
        | undefined {
        return this._repeatContext;
    }

    public getFocusKey(): string | undefined {
        return this._focusKey;
    }

    public setFocusKey(value?: string): this {
        this._focusKey = value;

        return this;
    }

    public hasPreferredFocus(): boolean {
        return this._hasPreferredFocus;
    }

    public setParentRecyclerView(recyclerView: Recycler) {
        this._parentRecyclerView = recyclerView;

        return this;
    }

    public getParentRecyclerView(): Recycler | undefined {
        return this._parentRecyclerView;
    }

    public setParentScrollView(scrollView: ScrollView) {
        this._parentScrollView = scrollView;

        return this;
    }

    public getParentScrollView(): ScrollView | undefined {
        return this._parentScrollView;
    }

    public verticalContentContainerGap(): number {
        return this._verticalContentContainerGap;
    }

    public horizontalContentContainerGap(): number {
        return this._horizontalContentContainerGap;
    }

    public getNode(): MutableRefObject<RNView> {
        return this.node;
    }
}

export default View;

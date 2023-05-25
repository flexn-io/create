import * as React from 'react';

//Interim solve given we want to be active on old react as well for now.
export abstract class ComponentCompat<
    T1 = Record<string, unknown>,
    T2 = Record<string, unknown>,
    SS = any
> extends React.Component<T1, T2, SS> {
    private _hasRenderedOnce = false;
    private _didPropsChange = false;

    constructor(props: T1, context?: any) {
        super(props, context);
    }

    public shouldComponentUpdate(newProps: T1): boolean {
        if (this.props !== newProps) {
            this.componentWillReceivePropsCompat();
        }
        return true;
    }

    //setState inside will not update the existing cycle, not a true replacement for componentWillReceiveProps
    public componentWillReceivePropsCompat(): void {
        //no op
    }

    public componentWillMountCompat(): void {
        //no op
    }

    public componentWillUpdateCompat(): void {
        //no op
    }

    public render(): React.ReactNode {
        if (!this._hasRenderedOnce) {
            this._hasRenderedOnce = true;
            this.componentWillMountCompat();
        } else {
            this.componentWillUpdateCompat();
        }
        return this.renderCompat();
    }

    public abstract renderCompat(): React.ReactNode;
}

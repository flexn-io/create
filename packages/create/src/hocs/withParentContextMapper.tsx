import React from 'react';

export function withParentContextMapper(WrappedComponent: any) {
    return class extends React.Component<any, any> {
        render() {
            const { focusContext } = this.props;

            const childrenWithProps = React.Children.map(this.props.children, (child) => {
                if (React.isValidElement(child)) {
                    //@ts-ignore
                    return React.cloneElement(child, { focusContext });
                }
                return child;
            });

            return <WrappedComponent {...this.props}>{childrenWithProps}</WrappedComponent>;
        }
    };
}

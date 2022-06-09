import React from 'react';


export function withParentContextMapper(WrappedComponent: any) {
    return class extends React.Component<any, any> {
        render() {
            const { parentContext } = this.props;

            const childrenWithProps = React.Children.map(this.props.children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, { parentContext: parentContext });
                }
                return child;
            });

            return (
                <WrappedComponent {...this.props}>
                    {childrenWithProps}
                </WrappedComponent>
            );
        }
    };
}
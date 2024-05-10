import React from 'react';

export function withParentContextMapper(
    WrappedComponent: React.ComponentType<any>
) {
    return class extends React.Component<any, any> {
        render() {
            const { focusContext } = this.props;

            const childrenWithProps = React.Children.map(
                this.props.children,
                (child) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(
                            child as React.ReactElement<any>,
                            {
                                focusContext,
                            }
                        );
                    }
                    return child;
                }
            );

            return (
                <WrappedComponent {...this.props}>
                    {childrenWithProps}
                </WrappedComponent>
            );
        }
    };
}

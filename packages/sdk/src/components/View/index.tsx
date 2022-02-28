import React from 'react';
import type { ViewProps } from '../../focusManager/types';

const View = React.forwardRef<any, ViewProps>((props, ref) => <View {...props} ref={ref} />);

View.displayName = 'View';

export default View;

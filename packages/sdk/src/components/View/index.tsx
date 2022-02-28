import React from 'react';
import { View as RNView } from 'react-native';
import type { ViewProps } from '../../focusManager/types';

const View = React.forwardRef<RNView>((props: ViewProps, ref) => <RNView {...props} ref={ref} />);

View.displayName = 'View';

export default View;

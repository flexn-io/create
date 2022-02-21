import React from 'react';
import { View as RNView } from 'react-native';
import type { ViewProps } from '../../focusManager/types';

const View = (props: ViewProps) => <RNView {...props} />;
export default View;

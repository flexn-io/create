import React from 'react';
import { TouchableOpacity as RNTouchableOpacity } from 'react-native';
import type { ViewProps } from '../../focusManager/types';
//TODO: forward ref
const TouchableOpacity = (props: ViewProps) => <RNTouchableOpacity {...props} />;
export default TouchableOpacity;

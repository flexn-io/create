import React from 'react';
import { Pressable as RNPressable } from 'react-native';
import type { PressableProps } from '../../focusManager/types';
//TODO: forward ref
const Pressable = (props: PressableProps) => <RNPressable {...props} />;
export default Pressable;

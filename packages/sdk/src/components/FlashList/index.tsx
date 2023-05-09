import React from 'react';
import { FlashList as FL } from '@shopify/flash-list';
import type { FlashListProps } from '../../focusManager/types';

const FlashList = (props: FlashListProps<any>) => <FL {...props} />;

export default FlashList;

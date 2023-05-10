/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */
import { Lightning, Router } from '@lightningjs/sdk';
import Button from '../../../../components/Button';
import { ROWS_COUNT } from './config';

export default class HomeScreen extends Lightning.Component {
    async _init() {
        this.focusIndex = 0;
    }

    static _template() {
        return {
            Wrapper: {
                rect: true,
                color: 0xff000000,
                w: 1920,
                h: 1080,
                flex: {
                    direction: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                Title: {
                    flexItem: { marginBottom: 10, alignSelf: 'center' },
                    text: { text: 'Performance Test 1 (Rows)', fontFace: 'Inter-Light' },
                },
                Rows: {
                    flex: {
                        direction: 'column',
                    },
                    children: [
                        ...ROWS_COUNT.map((count) => ({
                            type: Button,
                            label: `${count} rows`,
                            onPress: () => Router.navigate('RowsScreen', { count }),
                        })),
                    ],
                },
            },
        };
    }

    _handleDown() {
        if (this.focusIndex < this.tag('Rows').children.length - 1) this.focusIndex++;
    }

    _handleUp() {
        if (this.focusIndex > 0) this.focusIndex--;
    }

    _getFocused() {
        return this.tag('Rows').children[this.focusIndex];
    }
}

/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */
import { Lightning } from '@lightningjs/sdk';
import Carousel from '../../../../components/Carousel/index.lng';
import { UNEVEN_ROWS_ITEM_COUNTS } from './config';

export default class HomeScreen extends Lightning.Component {
    static _template() {
        return {
            Wrapper: {
                rect: true,
                color: 0xff000000,
                w: 1920,
                flex: { direction: 'column' },
                Title: {
                    flexItem: { marginBottom: 10, alignSelf: 'center' },
                    text: { text: 'Focus Test 3 (Uneven rows)', fontFace: 'Inter-Light' },
                },
                Rows: {
                    flex: {
                        direction: 'column',
                    },
                    children: UNEVEN_ROWS_ITEM_COUNTS.map((rowItemCount) => ({
                        flexItem: { marginBottom: 20 },
                        type: Carousel,
                        data: [...Array(rowItemCount).keys()],
                    })),
                },
            },
        };
    }

    _init() {
        this.focusedRowIndex = 0;
    }

    _handleUp() {
        if (this.focusedRowIndex === 0) {
            return;
        }
        this.focusedRowIndex--;
        this._scrollToIndex(this.focusedRowIndex);
    }

    _handleDown() {
        const lastIndex = this.tag('Rows').children.length - 1;
        if (this.focusedRowIndex === lastIndex) {
            return;
        }
        this.focusedRowIndex++;
        this._scrollToIndex(this.focusedRowIndex);
    }

    _scrollToIndex(index = this.focusedRowIndex) {
        if (index > this.tag('Rows').children.length - 3) return;
        this.tag('Wrapper').patch({ smooth: { y: index ? index * -318 : 0 } });
    }

    _getFocused() {
        return this.tag('Rows').children[this.focusedRowIndex];
    }
}

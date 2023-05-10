/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */
import { Lightning } from '@lightningjs/sdk';
import Carousel from '../../../../../components/Carousel/index.lng';

export default class HomeScreen extends Lightning.Component {
    set params({ count }) {
        this.count = count;
        this.tag('Rows').patch({
            children: [...Array(count).keys()].map(() => ({
                flexItem: { marginBottom: 20 },
                type: Carousel,
                data: [...Array(24).keys()],
            })),
        });
        this.tag('Title').patch({
            text: { text: `${count} rows`, fontFace: 'Inter-Light' },
        });
    }

    static _template() {
        return {
            Wrapper: {
                rect: true,
                color: 0xff000000,
                w: 1920,
                flex: { direction: 'column' },
                Title: {
                    flexItem: { marginBottom: 10, alignSelf: 'center' },
                    text: { text: '' },
                },
                Rows: {
                    flex: {
                        direction: 'column',
                    },
                    children: [],
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

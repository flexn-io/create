/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */

import { Lightning } from '@lightningjs/sdk';

class Square extends Lightning.Component {
    static _template() {
        return {
            flexItem: { margin: 10 },
            rect: true,
            color: 0xff008000,
            w: 200,
            h: 200,
        };
    }

    _focus() {
        this.patch({ smooth: { alpha: 1, scale: 1.2 } });
    }

    _unfocus() {
        this.patch({ smooth: { alpha: 0.8, scale: 1 } });
    }
}

export default class Carousel extends Lightning.Component {
    static _template() {
        return {
            flex: { direction: 'column', paddingLeft: 36, paddingTop: 24 },
            children: [
                {
                    text: '',
                },
                {
                    children: [],
                },
            ],
        };
    }

    set data(row) {
        this.rowItems = row.map((item) => ({
            type: Square,
            data: item,
        }));
        this.patch({
            children: [
                {
                    text: {
                        text: `${this.rowItems.length} items`,
                        fontFace: 'Inter-Light',
                    },
                },
                {
                    flex: { direction: 'row' },
                    children: this.rowItems,
                },
            ],
        });
    }

    $onItemPress(item) {
        if (this.onItemPress) this.onItemPress(item);
    }

    _init() {
        this.focusIndex = 0;
    }

    _setFocusIndex(idx) {
        this.focusIndex = idx;
    }

    _handleLeft() {
        if (this.focusIndex > 0) {
            this._setFocusIndex(this.focusIndex - 1);
            this._scrollToIndex(this.focusIndex);
        } else {
            this.signal('focusDrawer');
        }
    }

    _handleRight() {
        if (this.focusIndex < this.rowItems.length - 1) {
            this._setFocusIndex(this.focusIndex + 1);
            this._scrollToIndex(this.focusIndex);
        }
    }

    _scrollToIndex(index = this.focusIndex) {
        if (index > this.rowItems.length - 5) return;
        // scroll packshot width + margin 2x
        this.children[1].patch({ smooth: { x: index ? -index * (200 + 20) : 0 } });
    }

    _getFocused() {
        return this.children[1].children[this.focusIndex];
    }
}

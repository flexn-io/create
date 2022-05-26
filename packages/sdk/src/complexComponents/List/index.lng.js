import { Lightning } from '@lightningjs/sdk';
import Row from '../Row/index.lng';
import Column from '../../lng/Column/index.lng';
export default class List extends Lightning.Component {
    static _template() {
        return {
            List: {
                type: Column,
                itemSpacing: 25,
                items: [],
            },
        };
    }

    _construct() {
        this._whenEnabled = new Promise((resolve) => (this._enable = resolve));
    }

    get _List() {
        return this.tag('List');
    }

    get w() {
        return this._w;
    }

    set w(value) {
        if (value !== this._w) {
            this._w = value;
            this.w = value;

            this._whenEnabled.then(() => {
                this._List.w = this.w;
            });
        }
    }

    get h() {
        return this._h;
    }

    set h(value) {
        if (value !== this._h) {
            this._h = value;
            this.h = value;

            this._whenEnabled.then(() => {
                this._List.h = this.h;
            });
        }
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
        this._whenEnabled.then(() => {
            this._List.items = this.data.map((rowData) => ({
                type: Row,
                data: rowData.items,
                itemsInViewport: rowData.itemsInViewport,
                itemSpacing: this.itemSpacing,
                focusOptions: this.focusOptions,
                lazyScroll: this.lazyScroll,
                card: this.card,
                row: this.row,
                title: {
                    ...(this.row.title || {}),
                    text: rowData.rowTitle,
                },
            }));
        });
    }

    get card() {
        return this._card || {};
    }

    set card(value) {
        this._card = value;
    }

    get row() {
        return this._row || {};
    }

    set row(value) {
        this._row = value;
    }

    get focusOptions() {
        return this._focusOptions;
    }

    set focusOptions(value) {
        this._focusOptions = value;
    }

    get itemSpacing() {
        return this._itemSpacing;
    }

    set itemSpacing(value) {
        if (value !== this._itemSpacing) {
            this._itemSpacing = value;
            this._whenEnabled.then(() => {
                this._List.itemSpacing = value;
            });
        }
    }

    get lazyScroll() {
        return this._lazyScroll;
    }

    set lazyScroll(value) {
        if (value !== this.lazyScroll) {
            this._lazyScroll = value;
        }
    }

    $onCardPress(eventValue) {
        this.signal('onPress', eventValue);
    }

    $onCardFocus(eventValue) {
        this.signal('onFocus', eventValue);
    }

    $onCardBlur(eventValue) {
        this.signal('onBlur', eventValue);
    }

    _getFocused() {
        return this._List;
    }
}

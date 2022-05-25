// import { Column, FocusManager } from '@lightningjs/ui-components';
import { Lightning } from '@lightningjs/sdk';
import Row from '../Row';
import Column from '../../lng/Column/index.lng';

export default class Grid extends Lightning.Component {
    static _template() {
        return {
            Grid: {
                type: Column,
                independentNavigation: true,
                plinko: true,
                scrollIndex: 1,
                items: [],
            },
        };
    }

    _construct() {
        this._whenEnabled = new Promise((resolve) => (this._enable = resolve));
        this._itemSpacing = 30;
        this._itemsInViewport = 6;
    }

    _init() {
        this._setItemSpacing();
    }

    get _Grid() {
        return this.tag('Grid');
    }

    get w() {
        return this._w;
    }

    set w(value) {
        if (value !== this._w) {
            this._w = value;
            this.w = value;

            this._whenEnabled.then(() => {
                this._Grid.w = this.w;
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
                this._Grid.h = this.h;
            });
        }
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
        this._whenEnabled.then(() => {
            const arrayOfRows = [];
            while (this.data.length) {
                arrayOfRows.push(this.data.splice(0, this.itemsInViewport));
            }
            this._Grid.items = arrayOfRows.map((rowData) => ({
                type: Row,
                data: rowData,
                focusOptions: this.focusOptions,
                itemSpacing: this.itemSpacing,
                itemsInViewport: this.itemsInViewport,
                independentNavigation: true,
                lazyScroll: this.lazyScroll,
                card: this.card,
                row: this.row,
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

    get scrollIndex() {
        return this._scrollIndex;
    }

    set scrollIndex(value) {
        if (value === this._scrollIndex) {
            this._scrollIndex = value;
            this._Grid.scrollIndex = value;
        }
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
            this._setItemSpacing();
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

    get itemsInViewport() {
        return this._itemsInViewport;
    }

    set itemsInViewport(value) {
        if (value !== this.itemsInViewport) {
            this._itemsInViewport = value;
        }
    }

    _setItemSpacing() {
        this._whenEnabled.then(() => {
            this._Grid.x = this.itemSpacing;
            this._Grid.y = this.itemSpacing;
        });
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
        return this._Grid;
    }
}

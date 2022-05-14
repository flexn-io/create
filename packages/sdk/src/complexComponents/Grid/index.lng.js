// import { Column, FocusManager } from '@lightningjs/ui-components';
import { Lightning } from '@lightningjs/sdk';
import Row from '../Row';
import Column from '../../lng/Column/index.lng';

export default class Grid extends Lightning.Component {
    static _template() {
        return {
            Grid: {
                h: 500,
                w: 1920,
                type: Column,
                plinko: true,
                itemSpacing: 25,
                items: [],
            },
        };
    }

    _construct() {
        this._whenEnabled = new Promise((resolve) => (this._enable = resolve), console.error);
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
            //TODO: measure how much to fit into one line
            const arrayOfRows = [];
            while (this.data.length) {
                arrayOfRows.push(this.data.splice(0, 5));
            }

            this._Grid.items = arrayOfRows.map((rowData) => ({
                type: Row,
                data: rowData,
                focusOptions: this.focusOptions,
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
                this._Grid.itemSpacing = value;
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
        return this._Grid;
    }
}

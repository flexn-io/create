import { Row as LngRow } from '@lightningjs/ui-components';
import { Lightning } from '@lightningjs/sdk';
import Card from '../Card';
export default class Row extends Lightning.Component {
    static _template() {
        return {
            h: 280,
            Row: {
                type: LngRow,
                itemSpacing: 25,
                items: [],
            },
        };
    }

    _construct() {
        this._whenEnabled = new Promise((resolve) => (this._enable = resolve), console.error);
    }

    get _Row() {
        return this.tag('Row');
    }

    get w() {
        return this._w;
    }

    set w(value) {
        if (value !== this._w) {
            this._w = value;
            this.w = value;

            this._whenEnabled.then(() => {
                this._Row.w = this.w;
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
                this._Row.h = this.h;
            });
        }
    }

    // END

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
        this._whenEnabled.then(() => {
            this._Row.items = this.data.map((item) => ({
                type: Card,
                src: item.backgroundImage,
                title: item.title,
                eventValue: item,
                focusOptions: this.focusOptions,
                ...this.card,
            }));
        });
    }

    get card() {
        return this._card || {};
    }

    set card(card) {
        this._card = card;
    }

    get focusOptions() {
        return this._focusOptions;
    }

    set focusOptions(value) {
        this._focusOptions = value;
    }

    set itemSpacing(value) {
        this._whenEnabled.then(() => {
            this._Row.itemSpacing = value;
        });
    }

    set lazyScroll(value) {
        this._whenEnabled.then(() => {
            this._Row.lazyScroll = value;
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
        return this._Row;
    }
}

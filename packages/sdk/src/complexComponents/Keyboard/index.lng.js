import { Keyboard as LNGKeyboard, Row } from '@lightningjs/ui-components';

export default class Keyboard extends LNGKeyboard {
    _createRows(rows = []) {
        return rows.map((keys) => {
            const h = (this.keysConfig && this.keysConfig.h) || 60;
            return {
                type: Row,
                h,
                wrapSelected: this.rowWrap === undefined ? true : this.rowWrap,
                neverScroll: true,
                itemSpacing: this._spacing,
                items: this._createKeys(keys),
            };
        });
    }
}

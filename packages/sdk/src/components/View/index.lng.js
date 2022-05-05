import Lightning from '@lightningjs/core';

export default class View extends Lightning.Component {
    static _template() {
        return {
            rect: true,
            color: 0xffffffff,
            w: 0,
            h: 0,
        };
    }

    get content() {
        return this._content;
    }

    set content(content) {
        this._content = content;
        this._render();
    }

    _init() {
        this._render();
    }

    _render() {
        this.patch(this.content);
    }
}
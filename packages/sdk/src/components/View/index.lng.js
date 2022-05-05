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
}

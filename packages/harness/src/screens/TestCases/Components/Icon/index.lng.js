import Lightning from '@lightningjs/core';
import { Icon as FlexnIcon } from '@flexn/sdk';
export default class Icon extends Lightning.Component {
    static _template() {
        return {
            type: FlexnIcon
        };
    }
}
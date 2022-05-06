import { Lightning } from '@lightningjs/sdk';
import { TextInput } from '@flexn/sdk';

export default class InputTest extends Lightning.Component {
    static _template() {
        return {
            rect: true,
            color: 0xff000000,
            w: 1920,
            h: 1080,
            flex: { justifyContent: 'center', alignItems: 'center', direction: 'column' },
            Input: {
                type: TextInput,
            },
        };
    }

    _getFocused() {
        return this.tag('Input');
    }
}

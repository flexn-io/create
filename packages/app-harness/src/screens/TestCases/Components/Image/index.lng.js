import Lightning from '@lightningjs/core';
import { Icon as FlexnIcon } from '@flexn/create';

export default class Icon extends Lightning.Component {
    static _template() {
        return {
            w: 1920,
            h: 1080,
            flex: { justifyContent: 'center', alignItems: 'center' },
            IconPNG: {
                type: FlexnIcon,
                w: 300,
                h: 500,
                source: 'https://c8.alamy.com/comp/EFACN6/sylvester-stallone-rambo-first-blood-part-ii-1985-EFACN6.jpg',
            },
        };
    }
}

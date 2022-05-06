import { Lightning } from '@lightningjs/sdk';
// import { Keyboard } from '@lightningjs/ui-components';
import Keyboard from '../../complexComponents/Keyboard';
import { getHexColor } from '../../helpers';

const defaultStyles = {
    width: 300,
    height: 50,
    borderColor: getHexColor('#000000'),
    backgroundColor: getHexColor('#FFFFFF'),
    textColor: getHexColor('#000000'),
};

const styles = {
    text: {
        textColor: defaultStyles.textColor,
        maxLines: 1,
        verticalAlign: 'middle',
        textOverflow: 'clip',
        paddingRight: 5,
        paddingLeft: 5,
        wordWrap: false,
        fontSize: 28,
        lineHeight: defaultStyles.height,
    },
};

export default class TextInput extends Lightning.Component {
    static _template() {
        console.log('window.innerWidth', window.innerWidth);
        return {
            rect: true,
            Input: {
                w: defaultStyles.w,
                h: defaultStyles.h,
                clipping: true,
                texture: Lightning.Tools.getRoundRect(
                    defaultStyles.width,
                    defaultStyles.height,
                    4,
                    1,
                    defaultStyles.borderColor,
                    true,
                    defaultStyles.backgroundColor
                ),
                Text: {
                    text: {
                        text: 'My lovely input value 1',
                        ...styles.text,
                    },
                },
            },
            Keyboard: {
                y: 1500,
                type: Keyboard,
                formats: {
                    qwerty: [
                        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
                        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
                        ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
                    ],
                },
            },
        };
    }
}

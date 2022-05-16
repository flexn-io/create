import { Lightning, Registry } from '@lightningjs/sdk';
import { KEYBOARD_FORMATS } from '@lightningjs/ui-components';
import Keyboard from '../../complexComponents/Keyboard';
import { getHexColor } from '../../helpers';

import debounce from 'lodash.debounce';

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
        return {
            rect: true,
            Input: {
                w: defaultStyles.width,
                h: defaultStyles.height,
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
                Caret: {
                    text: {
                        text: '',
                        ...styles.text,
                    },
                },
                Text: {
                    text: {
                        text: '',
                        ...styles.text,
                    },
                },
            },
            Keyboard: {
                type: Keyboard,
                visible: false,
                formats: KEYBOARD_FORMATS.qwerty,
            },
        };
    }

    _construct() {
        this.isKeyboardOpen = false;
        this.isTyping = false;
        this.caretOffset = 0;
        this.onType = debounce(this.onTypeDebounced.bind(this), 500);
        this.interval = null;
    }

    _init() {
        let showCaret = true;
        this.interval = Registry.setInterval(() => {
            if (!this.isTyping && this.isKeyboardOpen) {
                this._setVirtualCaret(showCaret);
                showCaret = !showCaret;
            } else {
                this._setVirtualCaret(false);
            }
        }, 500);
    }

    _inactive() {
        Registry.clearInterval(this.interval);
    }

    static _states() {
        return [
            class KeyboardOpen extends this {
                _handleDown() {
                    return;
                }
                _handleUp() {
                    return;
                }
                _handleLeft() {
                    return;
                }
                _handleRight() {
                    return;
                }
            },
            class KeyboardClose extends this {},
        ];
    }

    get value() {
        return this.tag('Input').tag('Text').text.text;
    }

    set input(template) {
        this.patch({
            Input: template,
        });
    }

    get keyboard() {
        return this._keyboard;
    }

    set keyboard(template) {
        this._keyboard = template;
        this.patch({
            Keyboard: template,
        });
    }

    onTypeDebounced() {
        this.isTyping = false;
    }

    $onSoftKey({ key }) {
        // Component can be measured from measureText method in utils
        const shouldMoveCaret = this.tag('Input').tag('Text').text._source?.w > this.tag('Input').w - 40;
        this.isTyping = true;
        this.onType();

        if (!shouldMoveCaret) {
            this.caretOffset = 0;
        }

        let { value } = this;

        switch (key) {
            case 'Delete':
                value = value.slice(0, -1);
                if (shouldMoveCaret) {
                    this.caretOffset += 20;
                }
                break;
            case 'Clear':
                value = '';
                this.caretOffset = 0;
                break;
            case 'Space':
                value = `${value} `;
                if (shouldMoveCaret) {
                    this.caretOffset -= 20;
                }
                break;
            case '#@!':
            case 'abc':
            case 'áöû':
            case 'shift':
                // Ignore these keys
                break;
            case 'Done':
                this._toggleKeyboard(false);
                return;
            default:
                value = `${value}${key}`;
                if (shouldMoveCaret) {
                    this.caretOffset -= 20;
                }
                break;
        }

        const template = {
            Input: {
                Text: {
                    x: this.caretOffset,
                    text: {
                        text: value,
                    },
                },
                Caret: {
                    x: this.caretOffset,
                    text: {
                        text: '',
                    },
                },
            },
        };
        this.patch(template);
    }

    _toggleKeyboard(shouldOpen) {
        this.isKeyboardOpen = shouldOpen;
        if (shouldOpen) {
            this._setState('KeyboardOpen');
        } else {
            this._setState('KeyboardClose');
        }
        const template = {
            Keyboard: {
                visible: shouldOpen,
                smooth: {
                    y: shouldOpen ? this.keyboard.y : 0,
                },
            },
            Caret: {
                text: {
                    text: '',
                },
            },
        };
        this.patch(template);
        this._refocus();
    }

    _setVirtualCaret(showCaret) {
        let { value } = this;

        const template = {
            Input: {
                Caret: {
                    text: {
                        text: `${value}${showCaret ? '|' : ''}`,
                    },
                },
            },
        };
        this.patch(template);
    }

    _focus() {
        const template = {
            Input: {
                texture: Lightning.Tools.getRoundRect(
                    defaultStyles.width,
                    defaultStyles.height,
                    4,
                    3,
                    defaultStyles.borderColor,
                    true,
                    defaultStyles.backgroundColor
                ),
            },
        };
        this.patch(template);
    }

    _unfocus() {
        const template = {
            Input: {
                texture: Lightning.Tools.getRoundRect(
                    defaultStyles.width,
                    defaultStyles.height,
                    4,
                    1,
                    defaultStyles.borderColor,
                    true,
                    defaultStyles.backgroundColor
                ),
            },
        };
        this.patch(template);
    }

    _handleEnter() {
        this._toggleKeyboard(true);
    }

    _getFocused() {
        if (this.isKeyboardOpen) {
            return this.tag('Keyboard');
        }
    }
}

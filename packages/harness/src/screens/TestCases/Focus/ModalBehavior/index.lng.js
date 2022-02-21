/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */
import { Lightning } from '@lightningjs/sdk';
import Button from '../../../../components/Button';

export default class HomeScreen extends Lightning.Component {
    static _template() {
        return {
            Wrapper: {
                rect: true,
                color: 0xff000000,
                h: 1080,
                w: 1920,
                flex: { direction: 'column', alignItems: 'center', justifyContent: 'center' },
                Title: {
                    flexItem: { marginBottom: 10, alignSelf: 'center' },
                    text: { text: 'Focus Test 4 (Modal behavior)', fontFace: 'Inter-Light' },
                },
                Button: {
                    type: Button,
                    label: 'OPEN MODAL',
                    signals: {
                        onPress: 'openModal',
                    },
                },
            },
            Modal: {
                rect: true,
                w: 1920 * 0.8,
                h: 1080 * 0.8,
                x: 1920 / 2,
                y: 1080 / 2,
                color: 0xffff0000,
                mount: 0.5,
                visible: false,
                flex: { direction: 'column', alignItems: 'center', justifyContent: 'center' },
                Buttons: {
                    flex: { direction: 'column', justifyContent: 'center', alignItems: 'center' },
                    TopSection: {
                        flexItem: { marginBottom: 10 },
                        w: 1920 * 0.8 * 0.75,
                        flex: { direction: 'row', justifyContent: 'space-between' },
                        One: {
                            type: Button,
                            label: 'Close Modal',
                            signals: {
                                onPress: 'closeModal',
                            },
                        },
                        Two: {
                            type: Button,
                            label: 'Close Modal',
                            signals: {
                                onPress: 'closeModal',
                            },
                        },
                    },
                    BottomSection: {
                        flex: { direction: 'row' },
                        One: {
                            type: Button,
                            label: 'Close Modal',
                            signals: {
                                onPress: 'closeModal',
                            },
                        },
                    },
                },
            },
        };
    }

    openModal() {
        this.tag('Modal').patch({
            visible: true,
        });
        this._setState('TopSection');
    }

    closeModal() {
        this.tag('Modal').patch({
            visible: false,
        });
        this._setState('Content');
    }

    _init() {
        this.topSectionfocusIndex = 0;
        this.bottomSectionfocusIndex = 0;
        this._setState('Content');
    }

    get topSectionChildren() {
        return this.tag('TopSection').children;
    }

    get bottomSectionChildren() {
        return this.tag('BottomSection').children;
    }

    static _states() {
        return [
            class Content extends this {
                _getFocused() {
                    return this.tag('Button');
                }
            },
            class TopSection extends this {
                _handleRight() {
                    if (this.topSectionfocusIndex < this.topSectionChildren.length - 1) {
                        this.topSectionfocusIndex++;
                    }
                }

                _handleLeft() {
                    if (this.topSectionfocusIndex > 0) {
                        this.topSectionfocusIndex--;
                    }
                }

                _handleDown() {
                    if (this.bottomSectionChildren.length > 0) {
                        this._setState('BottomSection');
                    }
                }

                _getFocused() {
                    return this.topSectionChildren[this.topSectionfocusIndex];
                }
            },
            class BottomSection extends this {
                _handleRight() {
                    if (this.bottomSectionfocusIndex < this.buttonsChildren.length - 1) {
                        this.bottomSectionfocusIndex++;
                    }
                }

                _handleLeft() {
                    if (this.bottomSectionfocusIndex > 0) {
                        this.bottomSectionfocusIndex--;
                    }
                }

                _handleUp() {
                    if (this.topSectionChildren.length > 0) {
                        this._setState('TopSection');
                    }
                }

                _getFocused() {
                    return this.bottomSectionChildren[this.bottomSectionfocusIndex];
                }
            },
        ];
    }
}

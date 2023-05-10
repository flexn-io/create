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
                w: 1920,
                h: 1080,
                flex: { direction: 'column', justifyContent: 'center', alignItems: 'center' },
                Title: {
                    flexItem: { marginBottom: 10 },
                    text: { text: 'Focus Test 1 (Misaligned buttons)', fontFace: 'Inter-Light' },
                },
                Buttons: {
                    flex: { direction: 'column', justifyContent: 'center', alignItems: 'center' },
                    TopSection: {
                        flexItem: { marginBottom: 10 },
                        w: 1920 * 0.85,
                        flex: { direction: 'row', justifyContent: 'space-between' },
                        One: {
                            type: Button,
                            label: '',
                        },
                        Two: {
                            type: Button,
                            label: '',
                        },
                    },
                    BottomSection: {
                        flex: { direction: 'row' },
                        One: {
                            type: Button,
                            label: '',
                        },
                    },
                },
            },
        };
    }

    _init() {
        this.topSectionfocusIndex = 0;
        this.bottomSectionfocusIndex = 0;
        this._setState('TopSection');
    }

    get topSectionChildren() {
        return this.tag('TopSection').children;
    }

    get bottomSectionChildren() {
        return this.tag('BottomSection').children;
    }

    static _states() {
        return [
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

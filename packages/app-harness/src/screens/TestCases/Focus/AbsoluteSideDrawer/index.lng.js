/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */
import { Lightning } from '@lightningjs/sdk';
import Carousel from '../../../../components/Carousel/index.lng';
import Drawer from '../../../../components/Drawer/index.lng';
import { ROWS_COUNT, DRAWER_BUTTONS_COUNT, ROW_ITEMS_COUNT } from './config';

export default class HomeScreen extends Lightning.Component {
    static _template() {
        return {
            Wrapper: {
                rect: true,
                color: 0xff000000,
                w: 1920,
                flex: { direction: 'column' },
                Title: {
                    flexItem: { marginBottom: 10, alignSelf: 'center' },
                    text: { text: 'Focus Test 1 (Absolute Side Drawer)', fontFace: 'Inter-Light' },
                },
                Rows: {
                    flex: {
                        direction: 'column',
                    },
                    children: [...Array(ROWS_COUNT).keys()].map(() => ({
                        flexItem: { marginBottom: 20 },
                        type: Carousel,
                        data: [...Array(ROW_ITEMS_COUNT).keys()],
                        signals: {
                            focusDrawer: true,
                        },
                    })),
                },
            },
            Drawer: {
                type: Drawer,
                items: [...Array(DRAWER_BUTTONS_COUNT).keys()],
                signals: {
                    blur: 'onDrawerBlur',
                },
            },
        };
    }

    focusDrawer() {
        this._setState('DrawerItems');
    }

    onDrawerBlur() {
        this._setState('Content');
    }

    _init() {
        this.focusedRowIndex = 0;
        this._setState('Content');
    }

    _scrollToIndex(index = this.focusedRowIndex) {
        if (index > this.tag('Rows').children.length - 3) return;
        this.tag('Wrapper').patch({ smooth: { y: index ? index * -318 : 0 } });
    }

    static _states() {
        return [
            class Content extends this {
                _handleUp() {
                    if (this.focusedRowIndex === 0) {
                        return;
                    }
                    this.focusedRowIndex--;
                    this._scrollToIndex(this.focusedRowIndex);
                }

                _handleDown() {
                    const lastIndex = this.tag('Rows').children.length - 1;
                    if (this.focusedRowIndex === lastIndex) {
                        return;
                    }
                    this.focusedRowIndex++;
                    this._scrollToIndex(this.focusedRowIndex);
                }

                _getFocused() {
                    return this.tag('Rows').children[this.focusedRowIndex];
                }
            },
            class DrawerItems extends this {
                _getFocused() {
                    return this.tag('Drawer');
                }
            },
        ];
    }
}

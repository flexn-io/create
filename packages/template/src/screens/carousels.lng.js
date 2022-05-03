/* eslint-disable no-underscore-dangle */
import { Lightning, Router } from '@lightningjs/sdk';
import { Row, Column } from '@lightningjs/ui-components';
import { getRandomData, getHexColor } from '../utils';
import { LAYOUT, THEME_LIGHT } from '../config';
import { ROUTES } from '../config.lng';

const itemsInRows = [3, 4, 5, 6, 4, 5];
class Card extends Lightning.Component {
    static _template() {
        return {
            rect: true,
            h: 250,
            src: '',
            Text: {
                y: 250,
                w: (w) => w - 50,
                text: {
                    fontSize: 28,
                    maxLinesSuffix: '...',
                    maxLines: 1,
                    textColor: getHexColor('#000000'),
                    text: '',
                },
            },
        };
    }

    _init() {
        const textColor = window.theme === THEME_LIGHT ? getHexColor('#000000') : getHexColor('#FFFFFF');
        this.patch({ Text: { text: { text: this.item.title, textColor } } });
    }

    _handleEnter() {
        Router.navigate(ROUTES.DETAILS, { row: this.item.rowNumber, index: this.item.index });
    }

    _focus() {
        this.smooth = { scale: 1.1 };
    }

    _unfocus() {
        this.smooth = { scale: 1 };
    }
}

export default class Carousels extends Lightning.Component {
    static _template() {
        return {
            rect: true,
            color: getHexColor('#FFFFFF'),
            w: LAYOUT.w,
            h: LAYOUT.h,
            Wrapper: {
                Cards: this._populateData(),
            },
        };
    }

    static _populateData() {
        const carouselsData = itemsInRows.map((count, rowNumber) => getRandomData(rowNumber, 0, count));

        return {
            type: Column,
            itemSpacing: 30,
            plinko: true,
            zIndex: 1,
            y: 20,
            h: LAYOUT.h,
            x: 150,
            items: carouselsData.map((column, index) => ({
                type: Row,
                h: 280,
                w: 1920,
                itemSpacing: 25,
                items: column.map((item) => ({
                    type: Card,
                    src: item.backgroundImage,
                    item: { ...item, rowNumber: index },
                    w: LAYOUT.w / itemsInRows[index],
                })),
            })),
        };
    }

    _init() {
        const color = window.theme === THEME_LIGHT ? getHexColor('#FFFFFF') : getHexColor('#000000');
        this.patch({ color });
    }

    _getFocused() {
        return this.tag('Wrapper').tag('Cards');
    }
}

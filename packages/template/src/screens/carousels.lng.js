/* eslint-disable no-underscore-dangle */
import { Lightning, Router } from '@lightningjs/sdk';
import { Row, Column } from '@lightningjs/ui-components';
import { getRandomData } from '../utils';
import { getHexColor, LAYOUT, THEME_LIGHT } from '../config';
import { ROUTES } from '../config.lng';

const itemsInRows = [
    [1, 3],
    [2, 4],
    [3, 5],
    [4, 6],
    [2, 4],
    [3, 5],
];

class Card extends Lightning.Component {
    static _template() {
        return {
            rect: true,
            h: 250,
            src: ''
        };
    }

    _init() {
        this.patch({ src: this.item.backgroundImage });
    }

    _handleEnter() {
        Router.navigate(ROUTES.DETAILS, { row: this.item.rowNumber, index: this.item.index });;
    }

    _focus() {
        this.patch({ smooth: { scale: 1.2 } });
    }

    _unfocus() {
        this.patch({ smooth: { scale: 1 } });
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
                Cards: this._populateData()
            }
        };
    }

    static _populateData() {
        const carouselsData = itemsInRows.map(([_, count], rowNumber) => getRandomData(rowNumber, count));

        return {
            type: Column,
            itemSpacing: 30,
            plinko: true,
            zIndex: 1,
            y: 0,
            h: LAYOUT.h,
            x: 130,
            items: carouselsData.map((column, index) => ({
                type: Row,
                h: 250,
                w: 1920,
                itemSpacing: 25,
                items: column.map((item, rowNumber) => ({
                    type: Card,
                    item: {...item, rowNumber },
                    w: LAYOUT.w / itemsInRows[index][1],
                }))
            }))
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
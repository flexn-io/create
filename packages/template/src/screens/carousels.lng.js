/* eslint-disable no-underscore-dangle */
import { Lightning, Router } from '@lightningjs/sdk';
import { List } from '@flexn/create';
import { getHexColor, interval, generateRandomItemsRow } from '../utils';
import { LAYOUT, THEME_LIGHT } from '../config';
import { ROUTES } from '../config.lng';
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
        const data = [...Array(10).keys()].map((rowNumber) => {
            const itemsInViewport = interval(3, 6);
            return {
                items: generateRandomItemsRow(rowNumber, itemsInViewport),
                itemsInViewport,
            };
        });

        return {
            w: LAYOUT.w,
            h: LAYOUT.h,
            x: 150,
            y: 50,
            List: {
                type: List,
                data,
                itemSpacing: 30,
                card: {
                    w: 350,
                    h: 300,
                },
                row: {
                    h: 420,
                    title: {
                        containerStyle: {},
                        textStyle: {},
                    },
                },
                focusOptions: {
                    animatorOptions: {
                        type: 'scale_with_border',
                        scale: 1.1,
                        borderColor: getHexColor('#0A74E6'),
                        borderRadius: 4,
                        borderWidth: 6,
                    },
                },
                signals: {
                    onFocus: '_onFocus',
                    onBlur: '_onBlur',
                    onPress: '_onPress',
                },
            },
        };
    }

    _init() {
        const color = window.theme === THEME_LIGHT ? getHexColor('#FFFFFF') : getHexColor('#000000');
        this.patch({ color });
    }

    _onPress(data) {
        Router.navigate(ROUTES.DETAILS, { row: data.rowNumber, index: data.index });
    }

    _getFocused() {
        return this.tag('Wrapper').tag('List');
    }
}

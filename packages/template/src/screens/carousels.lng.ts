/* eslint-disable no-underscore-dangle */
import { Lightning, Router } from '@lightningjs/sdk';
import { getHexColor, interval, generateRandomItemsRow, DataItem } from '../utils';
import { LAYOUT, THEME_LIGHT } from '../config';
import { ROUTES } from '../config.lng';

interface Cards extends Lightning.Component.TemplateSpec {
    List: typeof List;
}
interface CarouselsTemplateSpec extends Lightning.Component.TemplateSpec {
    Wrapper: {
        Cards: Cards;
    };
}

export interface CarouselsTypeConfig extends Lightning.Component.TypeConfig {
    IsPage: true;
}

export default class Carousels
    extends Lightning.Component<CarouselsTemplateSpec, CarouselsTypeConfig>
    implements Lightning.Component.ImplementTemplateSpec<CarouselsTemplateSpec>
{
    static override _template(): Lightning.Component.Template<CarouselsTemplateSpec> {
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

    static _populateData(): Lightning.Component.Template<CarouselsTemplateSpec['Wrapper']['Cards']> {
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

    _onPress(data: DataItem) {
        Router.navigate(ROUTES.DETAILS, { row: data.rowNumber, index: data.index });
    }

    _getFocused() {
        return this.tag('Wrapper.Cards.List');
    }
}

interface ListTemplateSpec extends Lightning.Component.TemplateSpec {
    data: any;
    itemSpacing: number;
    card: {
        w: number;
        h: number;
    };
    row: {
        h: number;
        title: {
            containerStyle: object;
            textStyle: object;
        };
    };
    focusOptions: object;
}

export interface ListTypeConfig extends Lightning.Component.TypeConfig {
    IsPage: true;
}

class List
    extends Lightning.Component<ListTemplateSpec, ListTypeConfig>
    implements Lightning.Component.ImplementTemplateSpec<ListTemplateSpec>
{
    static override _template(): Lightning.Component.Template<ListTemplateSpec> {
        return {};
    }

    get data() {
        return null;
    }

    get itemSpacing() {
        return 0;
    }

    get card() {
        return {
            w: 0,
            h: 0,
        };
    }

    get row() {
        return {
            h: 0,
            title: {
                containerStyle: {},
                textStyle: {},
            },
        };
    }

    get focusOptions() {
        return {};
    }
}

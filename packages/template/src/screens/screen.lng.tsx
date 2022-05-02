/* eslint-disable no-underscore-dangle */
import { Lightning } from '@lightningjs/sdk';
import { getHexColor } from '../config';

export default class Screen extends Lightning.Component {
    _construct() {
        this.theme = 'LightTheme';
    }

    static _states() {
        return [
            class LightTheme extends this {
                $enter() {
                    this.patch({
                        color: getHexColor('#FFFFFF'),
                    });
                    this.patch({
                        Button1: {
                            textStyle: {
                                color: getHexColor('#000000'),
                            }
                        },
                        Button2: {
                            textStyle: {
                                color: getHexColor('#000000'),
                            }
                        }
                    });
                    this.theme = 'LightTheme';
                }
            },
            class DarkTheme extends this {
                $enter() {
                    this.patch({
                        color: getHexColor('#000000'),
                    });
                    this.patch({
                        Button1: {
                            textStyle: {
                                color: getHexColor('#FFFFFF'),
                            }
                        },
                        Button2: {
                            textStyle: {
                                color: getHexColor('#FFFFFF'),
                            }
                        }
                    });
                    this.theme = 'DarkTheme';
                }
            }
        ];
    }
}
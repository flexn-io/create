import { Lightning, Utils } from '@lightningjs/sdk';

export default class Splash extends Lightning.Component {
    static _template() {
        return {
            Background: {
                w: 1920,
                h: 1080,
                color: 0xfffbb03b,
                src: Utils.asset('images/background.png'),
            },
            Logo: {
                mountX: 0.5,
                mountY: 1,
                x: 960,
                y: 600,
                src: Utils.asset('images/logo.png'),
            },
        };
    }

    _init() {
        this.tag('Background')
            .animation({
                duration: 15,
                repeat: -1,
                actions: [
                    {
                        t: '',
                        p: 'color',
                        v: { 0: { v: 0xfffbb03b }, 0.5: { v: 0xfff46730 }, 0.8: { v: 0xfffbb03b } },
                    },
                ],
            })
            .start();
    }
}

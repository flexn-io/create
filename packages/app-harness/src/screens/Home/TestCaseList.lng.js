/* eslint-disable no-underscore-dangle */
import { Lightning, Router } from '@lightningjs/sdk';
import Button from '../../components/Button';

export default class TestCaseList extends Lightning.Component {
    static _template() {
        return {
            flex: {
                direction: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            },
        };
    }

    _init() {
        this.focusIndex = 2; // first two children aren't buttons
    }

    set testCases(testCases) {
        const testCaseKeys = Object.keys(testCases.tests);

        this.children = [
            {
                text: {
                    text: testCases.label,
                    fontFace: 'Inter-Light',
                },
            },
            !testCaseKeys.length && {
                text: {
                    text: 'There are no test cases yet',
                    fontFace: 'Inter-Light',
                    fontSize: 25,
                    textColor: testCases.color,
                },
            },
            ...testCaseKeys.map((testCase) => ({
                type: Button,
                label: testCase,
                onPress: () => Router.navigate(testCase),
            })),
        ];
    }

    _getFocused() {
        return this.children[this.focusIndex];
    }

    _handleUp() {
        if (this.focusIndex > 2) {
            this.focusIndex--;
        } else {
            this.signal('onEndReached', 'up');
        }
    }

    _handleDown() {
        if (this.focusIndex < this.children.length - 1) {
            this.focusIndex++;
        } else {
            this.signal('onEndReached', 'down');
        }
    }
}

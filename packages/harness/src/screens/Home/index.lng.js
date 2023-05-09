/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */
import { Lightning } from '@lightningjs/sdk';
// @ts-expect-error will only exist after rnv run
import runtime from '../../../platformAssets/renative.runtime.json';
import CategorizedTestCases from '../TestCases';
import TestCaseList from './TestCaseList';

const testCaseCategoryColors = [0xff008080, 0xffffa500, 'cornflowerblue', 'coral', 'chocolate'];

export default class HomeScreen extends Lightning.Component {
    async _init() {
        this.focusIndex = 0;
    }

    static _template() {
        return {
            Wrapper: {
                rect: true,
                color: 0xff000000,
                w: 1920,
                h: 1080,
                flex: {
                    direction: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                children: [
                    ...Object.entries(CategorizedTestCases).map(([testCasesCategory, testCases], idx) => ({
                        type: TestCaseList,
                        testCases: {
                            label: testCasesCategory,
                            tests: testCases,
                            color: testCaseCategoryColors[idx],
                        },
                        signals: {
                            onEndReached: 'handleEndReached',
                        },
                    })),
                ],
            },
            BuildTimestamp: {
                x: 1920 - 10,
                mountX: 1,
                y: 25,
                color: 0xffffffff,
                text: {
                    text: `Version: ${runtime.appVersion}  Built: ${runtime.timestamp}`,
                    fontSize: 25,
                    fontFace: 'Inter-Light',
                },
            },
        };
    }

    handleEndReached(direction) {
        if (direction === 'up' && this.focusIndex > 0) {
            this.focusIndex--;
            if (Object.values(Object.values(CategorizedTestCases)[this.focusIndex]).length === 0) {
                this.focusIndex--;
            }
        }

        if (direction === 'down' && this.focusIndex < this.tag('Wrapper').children.length - 1) {
            this.focusIndex++;
            if (Object.values(Object.values(CategorizedTestCases)[this.focusIndex]).length === 0) {
                this.focusIndex++;
            }
        }
    }

    _getFocused() {
        return this.tag('Wrapper').children[this.focusIndex];
    }
}

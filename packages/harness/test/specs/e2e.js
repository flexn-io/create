const FlexnRunner = require('@flexn/graybox').default;

describe('Test Harness app', () => {
    before(() => {
        FlexnRunner.launchApp();
    });
    if (process.env.PLATFORM === 'macos') {
        it('expect first button to be existing by ID', async () => {
            await FlexnRunner.waitForDisplayedById('flexn-screens-home-test-case-list-button-0-0');
            await FlexnRunner.clickById('flexn-screens-home-test-case-list-button-1-0');
            await FlexnRunner.waitForDisplayedById('flexn-screens-focus-performance-rows-button-0-rows-amount-10');
            await FlexnRunner.expectToBeClickableById('flexn-screens-focus-performance-rows-button-9-rows-amount-5120');
            // await FlexnRunner.scrollById('flexn-screens-focus-performance-rows-button-9-rows-amount-5120', 'down', 'flexn-screens-focus-performance-rows-button-0-rows-amount-10');
            await FlexnRunner.pause(20000);
        });
    } else {
        it('navigate to rows screen and return to home screen and expect Rows button to be displayed by ID', async () => {
            await FlexnRunner.waitForDisplayedById('flexn-screens-home-test-case-list-button-0-0');
            await FlexnRunner.pressButtonDown(10);
            if (process.env.PLATFORM === 'web') {
                await FlexnRunner.scrollById('flexn-screens-home-test-case-list-button-1-0', 'down');
                await FlexnRunner.clickById('flexn-screens-home-test-case-list-button-1-0');
            } else {
                await FlexnRunner.scrollById('flexn-screens-home-test-case-list-button-2-0', 'down');
                await FlexnRunner.clickById('flexn-screens-home-test-case-list-button-2-0');
                await FlexnRunner.pressButtonSelect(1);
            }
            await FlexnRunner.waitForDisplayedById('flexn-screens-focus-performance-rows-button-0-rows-amount-10');
            await FlexnRunner.pressButtonBack(1);
            await FlexnRunner.expectToBeDisplayedById('flexn-screens-home-test-case-list-button-2-0');
        });
    }
});

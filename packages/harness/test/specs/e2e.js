const FlexnRunner = require('@flexn/graybox').default;

describe('Test Harness app', () => {
    before(() => {
        FlexnRunner.launchApp();
    });
    it('navigate to rows screen and and expect 10 Rows button to be displayed by text', async () => {
        await FlexnRunner.waitForDisplayedById('flexn-screens-home-test-case-list-button-0-0');
        if (process.env.PLATFORM === 'web' || process.env.PLATFORM === 'macos') {
            await FlexnRunner.scrollById('flexn-screens-home-test-case-list-button-1-0', 'down', 'flexn-screens-home-test-case-list-button-0-0');
            await FlexnRunner.clickById('flexn-screens-home-test-case-list-button-1-0');
        } else {
            await FlexnRunner.scrollById('flexn-screens-home-test-case-list-button-2-0', 'down');
            await FlexnRunner.clickById('flexn-screens-home-test-case-list-button-2-0');
        }
        await FlexnRunner.pressButtonDown(10);
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedByText('10 rows');
    });
});

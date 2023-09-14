const FlexnRunner = require('@flexn/graybox').default;

describe('Test Harness app', () => {
    before(() => {
        FlexnRunner.launchApp();
    });
    it('--> scroll to Rows button and expect Rows button to be displayed by text', async () => {
        await FlexnRunner.pause(5000);
    });

    it('focus on row test', async () => {
        await FlexnRunner.pressButtonRight(1);
    });

    it('open row test', async () => {
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'R1-0');
    });
});

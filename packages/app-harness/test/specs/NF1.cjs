const FlexnRunner = require('@flexn/graybox').default;

describe('NF1', () => {
    before(() => {
        FlexnRunner.launchApp();
    });
    it('Check that next focus test is displayed in home page', async () => {
        await FlexnRunner.expectToBeDisplayedById('home-NF1');
    });

    it('Focus on next focus test', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.pressButtonRight(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'home-NF1');
    });

    it('Open next focus test', async () => {
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedByText('#NF1 ');
    });

    it('Focus is on first button', async () => {
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'NF1-B1');
    });

    it('Click down while on first button', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'NF1-B4');
    });

    it('Click up while on fourth button', async () => {
        await FlexnRunner.pressButtonUp(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'NF1-B1');
    });

    it('Focus on second button', async () => {
        await FlexnRunner.pressButtonRight(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'NF1-B2');
    });

    it('Click left while on second button', async () => {
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'NF1-B3');
    });

    it('Click right while on third button', async () => {
        await FlexnRunner.pressButtonRight(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'NF1-B2');
    });

    it('Go back to home page', async () => {
        await FlexnRunner.pressButtonBack(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'home-NF1');
    });
});

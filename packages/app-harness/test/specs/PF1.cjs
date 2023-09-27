const FlexnRunner = require('@flexn/graybox').default;

describe('PF1', () => {
    before(() => {
        FlexnRunner.launchApp();
    });
    it('Check that prefered focus test is displayed in home page', async () => {
        await FlexnRunner.expectToBeDisplayedById('home-PF1');
    });

    it('Focus on prefered focus test', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.pressButtonRight(3);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'home-PF1');
    });

    it('Open prefered focus test', async () => {
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedByText('#PF1 ');
    });

    it('Focus is on fourth button', async () => {
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'PF1-B4');
    });

    it('Go back to home page', async () => {
        await FlexnRunner.pressButtonBack(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'home-PF1');
    });
});

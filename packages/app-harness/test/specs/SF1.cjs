const FlexnRunner = require('@flexn/graybox').default;

describe('Set Focus', () => {
    before(() => {
        FlexnRunner.launchApp();
    });

    it('Check that set focus test is displayed in home page', async () => {
        await FlexnRunner.expectToBeDisplayedById('home-SF1');
    });

    it('Focus on set focus test', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.pressButtonRight(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'home-SF1');
    });

    it('Open set focus test', async () => {
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedByText('#SF1 ');
    });

    it('Focus is on first button', async () => {
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'SF1-B1');
    });

    it('Click first button', async () => {
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'SF1-B3');
    });

    it('Focus on second button', async () => {
        await FlexnRunner.pressButtonUp(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'SF1-B2');
    });

    it('Click second button', async () => {
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'SF1-B4');
    });

    it('Go back to home page', async () => {
        await FlexnRunner.pressButtonBack(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'home-SF1');
    });
});

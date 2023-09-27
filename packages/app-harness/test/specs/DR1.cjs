const FlexnRunner = require('@flexn/graybox').default;

describe('DR1', () => {
    before(() => {
        FlexnRunner.launchApp();
    });
    it('Check that dynamic rows test is displayed in home page', async () => {
        await FlexnRunner.expectToBeDisplayedById('home-DR1');
    });

    it('Focus on dynamic rows test', async () => {
        await FlexnRunner.pressButtonRight(4);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'home-DR1');
    });

    it('Open dynamic rows test', async () => {
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedByText('#DR1 ');
    });

    it('Focus is on first item', async () => {
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'DR1-0-0');
    });

    it('Focus on first item in second row', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'DR1-1-0');
    });

    it('Focus on last item in second row', async () => {
        await FlexnRunner.pressButtonRight(4);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'DR1-1-4');
    });

    it('Focus is on first item in first row', async () => {
        await FlexnRunner.pressButtonUp(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'DR1-0-0');
    });

    it('Check if focus in second row is saved', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'DR1-1-4');
    });

    it('Focus is on first item in first row', async () => {
        await FlexnRunner.pressButtonUp(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'DR1-0-0');
    });

    it('Regenerate data', async () => {
        await FlexnRunner.pressButtonSelect(1);
    });

    it('Check if focus in second row is reset', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'DR1-1-0');
    });

    it('Go back to home page', async () => {
        await FlexnRunner.pressButtonBack(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'home-DR1');
    });
});

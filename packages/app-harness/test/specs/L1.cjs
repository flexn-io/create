const FlexnRunner = require('@flexn/graybox').default;

describe('L1', () => {
    before(() => {
        FlexnRunner.launchApp();
    });

    it('Check that list test is displayed in home page', async () => {
        await FlexnRunner.expectToBeDisplayedById('home-L1');
    });

    it('Focus on list test', async () => {
        await FlexnRunner.pressButtonRight(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'home-L1');
    });

    it('Open list test', async () => {
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedByText('#L1 ');
    });

    it('Focus is on first item', async () => {
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-0-0');
    });

    it('Focus remains on first item after clicking left', async () => {
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-0-0');
    });

    it('Focus remains on first item after clicking up', async () => {
        await FlexnRunner.pressButtonUp(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-0-0');
    });

    it('Focus on second item on first row', async () => {
        await FlexnRunner.pressButtonRight(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-0-1');
    });

    it('Focus on first item on second row', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-1-0');
    });

    it('Focus on last item on second row', async () => {
        await FlexnRunner.pressButtonRight(9);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-1-9');
    });

    it('Focus remains on last item after clicking right', async () => {
        await FlexnRunner.pressButtonRight(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-1-9');
    });

    it('Focus on first item on third row', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-2-0');
    });

    it('Focus on first item on last row', async () => {
        await FlexnRunner.pressButtonDown(7);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-9-0');
    });

    it('Focus remains on last row after clicking down', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-9-0');
    });

    it('Check that it remembers focus of the third row', async () => {
        await FlexnRunner.pressButtonUp(7);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-2-0');
    });

    it('Check that it remembers focus of the second row', async () => {
        await FlexnRunner.pressButtonUp(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-1-9');
    });

    it('Check that it remembers focus of the first row', async () => {
        await FlexnRunner.pressButtonUp(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-0-1');
    });

    it('Go back to home page', async () => {
        await FlexnRunner.pressButtonBack(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'home-L1');
    });
});

const FlexnRunner = require('@flexn/graybox').default;

describe('L1', () => {
    before(() => {
        FlexnRunner.launchApp();
    });
    it('check that all tests are displayed', async () => {
        await FlexnRunner.expectToBeDisplayedById('home-L1');
    });

    it('focus on list test', async () => {
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'home-L1');
    });

    it('open list test', async () => {
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedByText('#L1 ');
    });

    it('focus on first item', async () => {
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-0-0');
    });

    it('focus remains on first item after clicking left', async () => {
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-0-0');
    });

    it('focus remains on first item after clicking up', async () => {
        await FlexnRunner.pressButtonUp(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-0-0');
    });

    it('focus on second item on first row', async () => {
        await FlexnRunner.pressButtonRight(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-0-1');
    });

    it('focus on first item on second row', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-1-0');
    });

    it('focus on last item on second row', async () => {
        await FlexnRunner.pressButtonRight(9);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-1-9');
    });

    it('focus remains on last item after clicking right', async () => {
        await FlexnRunner.pressButtonRight(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-1-9');
    });

    it('focus on first item on last row', async () => {
        await FlexnRunner.pressButtonDown(8);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-9-0');
    });

    it('focus remains on last row after clicking down', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-9-0');
    });

    it('check that it remembers focus of the second row', async () => {
        await FlexnRunner.pressButtonUp(8);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-1-9');
    });

    it('check that it remembers focus of the first row', async () => {
        await FlexnRunner.pressButtonUp(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-0-1');
    });
});

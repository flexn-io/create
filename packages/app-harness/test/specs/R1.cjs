const FlexnRunner = require('@flexn/graybox').default;

describe('R1', () => {
    before(() => {
        FlexnRunner.launchApp();
    });

    it('Check that row test is displayed in home page', async () => {
        await FlexnRunner.expectToBeDisplayedById('home-R1');
    });

    it('Focus on row test', async () => {
        await FlexnRunner.pressButtonRight(2);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'home-R1');
    });

    it('Open row test', async () => {
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedByText('#R1 ');
    });

    it('Focus is on first item', async () => {
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'R1-0');
    });

    it('Scroll row to the end', async () => {
        for (let i = 1; i <= 19; i++) {
            await FlexnRunner.pressButtonRight(1);
            await FlexnRunner.expectToHaveTextById('focused-element-selector', `R1-${i}`);
        }
    });

    it('Focus is on last item and click right', async () => {
        await FlexnRunner.pressButtonRight(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'R1-19');
    });

    it('Focus is on last item and click up', async () => {
        await FlexnRunner.pressButtonUp(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'R1-19');
    });

    it('Focus is on last item and click down', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'R1-19');
    });

    it('Scroll row to the beginning', async () => {
        for (let i = 18; i >= 0; i--) {
            await FlexnRunner.pressButtonLeft(1);
            await FlexnRunner.expectToHaveTextById('focused-element-selector', `R1-${i}`);
        }
    });

    it('Focus is on first item and click left', async () => {
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'R1-0');
    });

    it('Focus is on first item and click up', async () => {
        await FlexnRunner.pressButtonUp(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'R1-0');
    });

    it('Focus is on first item and click down', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'R1-0');
    });

    it('Go back to home page', async () => {
        await FlexnRunner.pressButtonBack(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'home-R1');
    });
});

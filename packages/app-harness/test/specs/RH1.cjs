const FlexnRunner = require('@flexn/graybox').default;

describe('RH1', () => {
    before(() => {
        FlexnRunner.launchApp();
    });

    it('Check that remote handler test is displayed in home page', async () => {
        await FlexnRunner.expectToBeDisplayedById('home-RH1');
    });

    it('Focus on remote handler test', async () => {
        await FlexnRunner.pressButtonRight(5);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'home-RH1');
    });

    it('Open remote handler test', async () => {
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedByText('#RH1 ');
    });

    it('Click up button', async () => {
        await FlexnRunner.pressButtonUp(1);
        await FlexnRunner.expectToHaveTextById('RH1-pressed-button', 'You pressed up');
    });

    it('Click down button', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.expectToHaveTextById('RH1-pressed-button', 'You pressed down');
    });

    it('Click left button', async () => {
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.expectToHaveTextById('RH1-pressed-button', 'You pressed left');
    });

    it('Click right button', async () => {
        await FlexnRunner.pressButtonRight(1);
        await FlexnRunner.expectToHaveTextById('RH1-pressed-button', 'You pressed right');
    });

    it('Click select button', async () => {
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToHaveTextById('RH1-pressed-button', 'You pressed select');
    });

    it('Go back to home page', async () => {
        await FlexnRunner.pressButtonBack(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'home-RH1');
    });
});

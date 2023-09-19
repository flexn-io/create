const FlexnRunner = require('@flexn/graybox').default;

describe('Test Harness app', () => {
    before(() => {
        FlexnRunner.launchApp();
    });
    it('check that all tests are displayed', async () => {
        await FlexnRunner.expectToBeDisplayedById('home-L1');
        await FlexnRunner.expectToBeDisplayedById('home-R1');
        await FlexnRunner.expectToBeDisplayedById('home-G1');
        await FlexnRunner.expectToBeDisplayedById('home-DR1');
        await FlexnRunner.expectToBeDisplayedById('home-RH1');
        await FlexnRunner.expectToBeDisplayedById('home-MWA1');
    });

    it('focus on row test', async () => {
        await FlexnRunner.pressButtonRight(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'home-R1');
    });

    it('open row test', async () => {
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedByText('#R1 ');
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'R1-0');
    });

    it('Scroll row to the end', async () => {
        await FlexnRunner.pressButtonRight(49);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'R1-49');
    });

    it('Focus is on last item and click to right', async () => {
        await FlexnRunner.pressButtonRight(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'R1-49');
    });

    it('Scroll row to the beginning', async () => {
        await FlexnRunner.pressButtonLeft(49);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'R1-0');
    });

    it('Focus is on first item and click to left', async () => {
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'R1-0')
    });

    it('go to home', async () => {
        await FlexnRunner.pressButtonBack(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'home-R1');
    });

    it('focus on remote handler test', async () => {
        await FlexnRunner.pressButtonRight(3);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'home-RH1');
    });

    it('open remote handler test', async () => {
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedByText('#RH1 ');
    });

    it('test up button', async () => {
        await FlexnRunner.pressButtonUp(1);
        await FlexnRunner.expectToHaveTextById('RH1-pressed-button', 'You pressed up');
    });

    it('test down button', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.expectToHaveTextById('RH1-pressed-button', 'You pressed down');
    });

    it('test left button', async () => {
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.expectToHaveTextById('RH1-pressed-button', 'You pressed left');
    });

    it('test right button', async () => {
        await FlexnRunner.pressButtonRight(1);
        await FlexnRunner.expectToHaveTextById('RH1-pressed-button', 'You pressed right');
    });

    it('test select button', async () => {
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToHaveTextById('RH1-pressed-button', 'You pressed select');
    });
 });

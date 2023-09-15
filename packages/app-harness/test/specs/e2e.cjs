const FlexnRunner = require('@flexn/graybox').default;

describe('Test Harness app', () => {
    before(() => {
        FlexnRunner.launchApp();
    });
    it('check that all tests are displayed', async () => {
        await FlexnRunner.expectToBeDisplayedById('harness-home-L1-pressable');
        await FlexnRunner.expectToBeDisplayedById('harness-home-R1-pressable');
        await FlexnRunner.expectToBeDisplayedById('harness-home-G1-pressable');
        await FlexnRunner.expectToBeDisplayedById('harness-home-DR1-pressable');
        await FlexnRunner.expectToBeDisplayedById('harness-home-RH1-pressable');
        await FlexnRunner.expectToBeDisplayedById('harness-home-MWA1-pressable');
    });

    it('open row test', async () => {
        await FlexnRunner.pressButtonRight(1);
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedByText('#R1 ');
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'harness-R1-0-pressable');
    });

    it.skip('focus on remote handler test', async () => {
        await FlexnRunner.pressButtonRight(4);
        await FlexnRunner.expectToBeFocusedById('harness-home-RH1-pressable');
    });

    it.skip('open remote handler test', async () => {
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedByText('#RH1 ');
    });

    it.skip('test up button', async () => {
        await FlexnRunner.pressButtonUp(1);
        await FlexnRunner.expectToHaveTextById('harness-RH1-pressed-button-text', 'You pressed up');
    });

    it.skip('test down button', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.expectToHaveTextById('harness-RH1-pressed-button-text', 'You pressed down');
    });

    it.skip('test left button', async () => {
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.expectToHaveTextById('harness-RH1-pressed-button-text', 'You pressed left');
    });

    it.skip('test right button', async () => {
        await FlexnRunner.pressButtonRight(1);
        await FlexnRunner.expectToHaveTextById('harness-RH1-pressed-button-text', 'You pressed right');
    });

    it.skip('test select button', async () => {
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToHaveTextById('harness-RH1-pressed-button-text', 'You pressed select');
    });
});

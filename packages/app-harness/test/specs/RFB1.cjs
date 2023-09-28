const FlexnRunner = require('@flexn/graybox').default;

describe('Row on focus blur', () => {
    before(() => {
        FlexnRunner.launchApp();
    });

    it('Check that row on focus blur test is displayed in home page', async () => {
        await FlexnRunner.expectToBeDisplayedById('home-RFB1');
    });

    it('Focus on row on focus blur test', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.pressButtonRight(4);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'home-RFB1');
    });

    it('Open row on focus blur test', async () => {
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedByText('#RFB1 ');
    });

    it('Focus on first row', async () => {
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'L1-0-0');
    });

    it('Check first row focus count', async () => {
        await FlexnRunner.expectToHaveTextById('additional-text-info-selector-0', 'Row 0 focused 1');
    });

    it('Focus count does not change after scrolling row', async () => {
        await FlexnRunner.pressButtonRight(1);
        await FlexnRunner.expectToHaveTextById('additional-text-info-selector-0', 'Row 0 focused 1');
    });

    it('Check second row focus count', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.expectToHaveTextById('additional-text-info-selector-0', 'Row 1 focused 1');
    });

    it('Check first row blur count', async () => {
        await FlexnRunner.expectToHaveTextById('additional-text-info-selector-1', 'Row 0 blurred 1');
    });

    it('Blur count does not change after scrolling row', async () => {
        await FlexnRunner.pressButtonRight(1);
        await FlexnRunner.expectToHaveTextById('additional-text-info-selector-1', 'Row 0 blurred 1');
    });

    it('Check third row focus count', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.expectToHaveTextById('additional-text-info-selector-0', 'Row 2 focused 1');
    });

    it('Check second row blur count', async () => {
        await FlexnRunner.expectToHaveTextById('additional-text-info-selector-1', 'Row 1 blurred 1');
    });

    it('Check second row focus count after going back', async () => {
        await FlexnRunner.pressButtonUp(1);
        await FlexnRunner.expectToHaveTextById('additional-text-info-selector-0', 'Row 1 focused 2');
    });

    it('Check third row blur count', async () => {
        await FlexnRunner.expectToHaveTextById('additional-text-info-selector-1', 'Row 2 blurred 1');
    });

    it('Check first row focus count after going back', async () => {
        await FlexnRunner.pressButtonUp(1);
        await FlexnRunner.expectToHaveTextById('additional-text-info-selector-0', 'Row 0 focused 2');
    });

    it('Check second row blur count after going back', async () => {
        await FlexnRunner.expectToHaveTextById('additional-text-info-selector-1', 'Row 1 blurred 2');
    });
});

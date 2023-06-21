/* eslint-disable no-undef */
// this file is only for internal test functionality testing
const FlexnRunner = require('@flexn/graybox').default;

describe('Test template', () => {
    before(() => {
        FlexnRunner.launchApp();
    });
    it('--> check if elements are displayed in Home Page', async () => {
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-flexn-image');
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-welcome-message-text');
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-version-number-text');
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-try-me-button');
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-now-try-me-button');
    });

    it.skip('test web element', async () => {
        const button = await FlexnRunner.getElementById('template-home-screen-try-me-button');
        expect(await browser.checkElement(button, 'try-me-light')).toBeLessThanOrEqual(10);
        await FlexnRunner.clickById('template-home-screen-try-me-button');
        expect(await browser.checkElement(button, 'try-me-dark')).toBeLessThanOrEqual(10);
    });

    it.skip('test web screen', async () => {
        expect(await browser.checkScreen('home-light')).toBeLessThanOrEqual(10);
        await FlexnRunner.clickById('template-home-screen-try-me-button');
        expect(await browser.checkScreen('home-dark')).toBeLessThanOrEqual(10);
    });

    it('test android element', async () => {
        const button = await FlexnRunner.getElementById('template-home-screen-try-me-button');
        await button.waitForDisplayed({ timeout: 60000 });
        await expect(
            (
                await driver.compareElement(button, 'try-me-light', { resizeDimensions: {} })
            ).misMatchPercentage
        ).toBeLessThanOrEqual(10);
        await FlexnRunner.clickById('template-home-screen-try-me-button');
        const button1 = await FlexnRunner.getElementById('template-home-screen-try-me-button');
        await button1.waitForDisplayed({ timeout: 60000 });
        await expect(
            (
                await driver.compareElement(button1, 'try-me-dark', { resizeDimensions: {} })
            ).misMatchPercentage
        ).toBeLessThanOrEqual(10);
    });

    it.skip('test android screen', async () => {
        await FlexnRunner.pause(2000);
        await expect((await driver.compareScreen('home-light')).misMatchPercentage).toBeLessThanOrEqual(10);
        await FlexnRunner.clickById('template-home-screen-try-me-button');
        await FlexnRunner.pause(1000);
        await expect((await driver.compareScreen('home-dark')).misMatchPercentage).toBeLessThanOrEqual(10);
    });

    it.skip('test element by id', async () => {
        await FlexnRunner.expectToMatchElementById('template-home-screen-try-me-button', 'try-me-light', 10);
        await FlexnRunner.clickById('template-home-screen-try-me-button');
        await FlexnRunner.expectToMatchElementById('template-home-screen-try-me-button', 'try-me-dark', 10);
    });

    it.skip('test element by text', async () => {
        await FlexnRunner.expectToMatchElementByText('Try Me!', 'try-me-light', 10);
        await FlexnRunner.clickById('template-home-screen-try-me-button');
        await FlexnRunner.expectToMatchElementByText('Try Me!', 'try-me-dark', 10);
    });

    it.skip('test screenshot', async () => {
        //only android
        await FlexnRunner.pause(2000);
        await FlexnRunner.expectToMatchScreen('home-light', 10);
        await FlexnRunner.clickById('template-home-screen-try-me-button');
        //only android
        await FlexnRunner.pause(1000);
        await FlexnRunner.expectToMatchScreen('home-dark', 10);
    });
});

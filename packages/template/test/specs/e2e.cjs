const FlexnRunner = require('@flexn/graybox');

describe('Test @flexn/template', () => {
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

    it('--> check if dark theme is displayed when "Try Me!" button is selected', async () => {
        await FlexnRunner.waitForDisplayedById('template-home-screen-try-me-button');
        await FlexnRunner.clickById('template-home-screen-try-me-button');
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.pause(1000);
        await FlexnRunner.expectToMatchScreen('home-dark');
    });

    it('--> check if light theme is displayed when "Try Me!" button is selected', async () => {
        await FlexnRunner.waitForDisplayedById('template-home-screen-try-me-button');
        await FlexnRunner.clickById('template-home-screen-try-me-button');
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.pause(1000);
        await FlexnRunner.expectToMatchScreen('home-light');
    });

    it('--> check if Carousels Page opens when "Carousels" button is selected', async () => {
        if (process.env.PLATFORM === 'android' || process.env.PLATFORM === 'ios') {
            await FlexnRunner.waitForDisplayedById('template-menu-drawer-button');
            await FlexnRunner.clickById('template-menu-drawer-button');
        }
        await FlexnRunner.clickById('template-menu-carousels-button');
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-carousels-screen-container');
    });

    it('--> check if Home Page opens when "Home" button is selected', async () => {
        if (process.env.PLATFORM === 'android' || process.env.PLATFORM === 'ios') {
            await FlexnRunner.waitForDisplayedById('template-menu-drawer-button');
            await FlexnRunner.clickById('template-menu-drawer-button');
        }
        await FlexnRunner.clickById('template-menu-home-button');
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.pressButtonUp(1);
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-flexn-image');
    });

    it('--> check if My Modal opens when "My Modal" button is selected', async () => {
        if (process.env.PLATFORM === 'android' || process.env.PLATFORM === 'ios') {
            await FlexnRunner.waitForDisplayedById('template-menu-drawer-button');
            await FlexnRunner.clickById('template-menu-drawer-button');
        }
        await FlexnRunner.clickById('template-menu-my-modal-button');
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.pressButtonDown(2);
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedByText('This is my Modal!');
    });

    it('--> check if My Modal closes when close button is selected', async () => {
        await FlexnRunner.waitForDisplayedById('template-modal-screen-close-button');
        await FlexnRunner.clickById('template-modal-screen-close-button');
        if (process.env.PLATFORM === 'android' || process.env.PLATFORM === 'ios') {
            await FlexnRunner.waitForDisplayedById('template-menu-home-button');
            await FlexnRunner.clickById('template-menu-home-button');
        }
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-flexn-image');
    });

    it('--> check if Carousels Page opens when "Now Try Me!" button is selected', async () => {
        await FlexnRunner.waitForDisplayedById('template-home-screen-now-try-me-button');
        await FlexnRunner.clickById('template-home-screen-now-try-me-button');
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-carousels-screen-container');
    });

    it('--> check if Details Page opens when packshot is selected', async () => {
        await FlexnRunner.waitForDisplayedById('template-carousels-screen-0-packshot');
        await FlexnRunner.clickById('template-carousels-screen-0-packshot');
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-details-screen-cat-image');
        await FlexnRunner.expectToBeDisplayedById('template-details-screen-cat-name-text');
    });

    it('--> check if Carousels Page opens when "Go back" button is selected', async () => {
        await FlexnRunner.waitForDisplayedById('template-details-screen-go-back-button');
        await FlexnRunner.clickById('template-details-screen-go-back-button');
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-carousels-screen-container');
    });

    it('--> check if Details Page opens when packshot is selected', async () => {
        await FlexnRunner.waitForDisplayedById('template-carousels-screen-0-packshot');
        await FlexnRunner.clickById('template-carousels-screen-0-packshot');
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-details-screen-cat-image');
        await FlexnRunner.expectToBeDisplayedById('template-details-screen-cat-name-text');
    });

    it('--> check if Home Page opens when "Go to home" button is selected', async () => {
        await FlexnRunner.waitForDisplayedById('template-details-screen-go-to-home-button');
        await FlexnRunner.clickById('template-details-screen-go-to-home-button');
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-flexn-image');
    });
});

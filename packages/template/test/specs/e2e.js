const FlexnRunner = require('@flexn/graybox').default;

describe('Test template', () => {
    before(() => {
        FlexnRunner.launchApp();
    });

    it.skip('--> check if elements are displayed in Home Page', async () => {
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-flexn-image');
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-welcome-message-text');
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-version-number-text');
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-try-my-button');
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-now-try-my-button');
    });

    it.skip('--> check if Carousels Page opens when "Carousels" button is selected', async () => {
        await FlexnRunner.waitForDisplayedById('template-home-screen-flexn-image');
        if (process.env.PLATFORM === 'android' || process.env.PLATFORM === 'ios') {
            await FlexnRunner.clickById('template-menu-drawer-button');
        }
        await FlexnRunner.clickById('template-menu-carousels-button');
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.pressButtonSelect(1);

        ////////////////////
        // await FlexnRunner.expectToBeDisplayedById('template-starter-my-page-text-container');
        ///////////////////////

        // if (process.env.PLATFORM === 'ios' || process.env.PLATFORM === 'macos') {
        //     await FlexnRunner.clickById('header-back');
        // } else if (process.env.PLATFORM === 'android') {
        //     await FlexnRunner.clickById('home, back');
        // } else {
        //     await FlexnRunner.clickById('template-menu-home-button');
        // }
        // await FlexnRunner.pressButtonLeft(1);
        // await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-flexn-image');
    });

    // works on all platforms
    it('--> check if My Modal opens when "My Modal" button is selected', async () => {
        await FlexnRunner.waitForDisplayedById('template-home-screen-flexn-image');
        if (process.env.PLATFORM === 'android' || process.env.PLATFORM === 'ios') {
            await FlexnRunner.clickById('template-menu-drawer-button');
        }
        await FlexnRunner.clickById('template-menu-my-modal-button');
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.pressButtonDown(2);
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-modal-screen-container');
        await FlexnRunner.clickById('template-modal-screen-close-button');
        await FlexnRunner.pressButtonSelect(1);
        if (process.env.PLATFORM === 'android' || process.env.PLATFORM === 'ios') {
            await FlexnRunner.clickById('template-menu-home-button');
        }
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-flexn-image');
    });

    // skipping because after clicking "Now Try Me!" TV's have no focus
    it.skip('--> check if Carousels Page opens when "Now Try Me!" button is selected', async () => {
        await FlexnRunner.waitForDisplayedById('template-home-screen-flexn-image');
        await FlexnRunner.clickById('template-home-screen-now-try-my-button');
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.pressButtonSelect(1);
        // should be 2 clicks, 3 are needed for ATV due to bug
        if (process.env.PLATFORM === 'androidtv') {
            await FlexnRunner.pressButtonDown(3);
        } else {
            await FlexnRunner.pressButtonDown(2);
        }
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-starter-my-page-text-container');
        if (process.env.PLATFORM === 'ios' || process.env.PLATFORM === 'macos') {
            await FlexnRunner.clickById('header-back');
        } else if (process.env.PLATFORM === 'android') {
            await FlexnRunner.clickById('home, back');
        } else {
            await FlexnRunner.clickById('template-starter-menu-home-button');
        }
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedById('template-home-screen-flexn-image');
    });
});
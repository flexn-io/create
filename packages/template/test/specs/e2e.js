const FlexnRunner = require('@flexn/graybox').default;

describe('Test template', () => {
    before(() => {
        FlexnRunner.launchApp();
    });

    // it('--> check if elements exists in Home screen', async () => {
    //     await FlexnRunner.expectToBeExistingByText('Flexn SDK Example');
    //     await FlexnRunner.expectToBeExistingById('template-screen-home-try-me-button');
    //     await FlexnRunner.expectToBeExistingById('template-screen-home-now-try-me-button');
    //     await FlexnRunner.expectToBeExistingById('template-screen-home-navigate-to-github');
    //     await FlexnRunner.expectToBeExistingById('template-screen-home-navigate-to-renative');
    //     await FlexnRunner.expectToBeExistingById('template-screen-home-navigate-to-twitter');
    // });

    // it('--> click "Try my" button', async () => {
    //     await FlexnRunner.clickById('template-screen-home-try-me-button');
    //     await FlexnRunner.pressButtonSelect(1);
    // });
    
    // it('--> click "Now try my" button', async () => {
    //     await FlexnRunner.pressButtonDown(1);
    //     await FlexnRunner.clickById('template-screen-home-now-try-me-button');
    //     await FlexnRunner.pressButtonSelect(1);
    // });

    it('--> check if elements exists in Home screen', async () => {
        await FlexnRunner.expectToBeExistingByText('Flexn SDK Example');
    });
});
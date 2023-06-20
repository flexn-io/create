// this file is only for internal test functionality testing
import FlexnRunner from '@flexn/graybox';

describe('Test wdio', () => {
    before(() => {
        FlexnRunner.launchApp();
    });
    it.skip('expect first button to exist', async () => {
        await FlexnRunner.expectToBeExistingByText('flexn-screens-home-test-case-list-button-0-0');
    });
    it.skip('expect first button to be displayed', async () => {
        await FlexnRunner.expectToBeDisplayedByText('flexn-screens-home-test-case-list-button-0-0');
    });
    it.skip('click on first button', async () => {
        FlexnRunner.GIVEN('Home screen is open');
        FlexnRunner.WHEN('First button is clicked');
        await FlexnRunner.clickById('flexn-screens-home-test-case-list-button-0-0');
        FlexnRunner.THEN('Next page opens');
        await FlexnRunner.pause(5000);
    });
    it.skip('click 10 times down and pause 10s (only tv support)', async () => {
        await FlexnRunner.pause(10000);
        await FlexnRunner.pressButtonDown(10);
        await FlexnRunner.pause(10000);
    });
    it('scroll on macos', async () => {
        await FlexnRunner.pause(5000);
        await FlexnRunner.clickById('flexn-screens-home-test-case-list-button-2-0');
        // await FlexnRunner.isClickableById('flexn-screens-home-test-case-list-button-0-0');
        // const elementas = await $('~flexn-screens-home-test-case-list-button-0-0');
        // const lala = await FlexnRunner.getElementById('flexn-screens-home-test-case-list-button-0-0');
        // await elementas.isClickable();
        // await elementas.getAttribute('clickable');
        // console.log('/////////////////////////////'+kazkas);
        await FlexnRunner.clickById('flexn-screens-focus-performance-rows-button-2-rows-amount-40');
        // await FlexnRunner.scrollById('flexn-screens-focus-performance-rows-screen-flat-list-row-19', 'down');
        // await FlexnRunner.clickById('flexn-screens-focus-performance-rows-screen-flat-list-row-19');
        await FlexnRunner.pause(5000);
        await FlexnRunner.pressButtonBack(2);
        // await FlexnRunner.pause(2000);
        // await FlexnRunner.pressButtonBack(2);
        // await FlexnRunner.pause(1000);
        // await FlexnRunner.pressButtonBack();
        // await browser.execute('macos: keys', { keys: ['XCUIKeyboardKeyControl','XCUIKeyboardKeyCommand', 'f' ]});
        // await browser.execute('macos: scroll', { x:100, y:100, deltaX:300, deltaY:-600 }); // these px are from screen corenr, not from app corner
        // await browser.execute('mobile: scroll', { direction: 'down', name: 'flexn-screens-home-test-case-list-button-4-0' });
        // const element = await FlexnRunner.getElementById('flexn-screens-home-test-case-list-button-0-0');
        // const attr = await element.getAttribute('j');
        // console.log("//////////////////////////////////"+attr);
        await FlexnRunner.pause(10000);
    });
});

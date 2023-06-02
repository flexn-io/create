import AbstractRunner from './AbstractRunner';
import { pressButtonAndroid } from './helpers';

class AndroidRunner extends AbstractRunner {
    launchApp = () => {
        // do nothing
    };

    getElementById = (selector: string) => {
        return $(`~${selector}`);
    };

    getElementByText = (selector: string) => {
        return $(`[text="${selector}"]`);
    };

    scrollById = async (selector: string) => {
        await browser.execute('mobile: scroll', { strategy: 'accessibility id', selector });
    };

    clickById = async (selector: string) => {
        await (await this.getElementById(selector)).click();
    };

    clickByText = async (selector: string) => {
        await (await this.getElementByText(selector)).click();
    };

    pressButtonHome = async (n: number) => {
        await pressButtonAndroid(n, 3);
    };

    pressButtonBack = async (n: number) => {
        await pressButtonAndroid(n, 4);
    };

    pressButtonUp = () => {
        // do nothing
    };

    pressButtonDown = () => {
        // do nothing
    };

    pressButtonLeft = () => {
        // do nothing
    };

    pressButtonRight = () => {
        // do nothing
    };

    pressButtonSelect = () => {
        // do nothing
    };

    expectToMatchElementById = async (selector: string, tag: string, acceptableMismatch = 5) => {
        const element = await this.getElementById(selector);
        await element.waitForDisplayed({ timeout: 60000 });
        await expect((await driver.compareElement(element, tag)).misMatchPercentage).toBeLessThanOrEqual(
            acceptableMismatch
        );
    };

    expectToMatchElementByText = async (selector: string, tag: string, acceptableMismatch = 5) => {
        const element = await this.getElementByText(selector);
        await element.waitForDisplayed({ timeout: 60000 });
        await expect((await driver.compareElement(element, tag)).misMatchPercentage).toBeLessThanOrEqual(
            acceptableMismatch
        );
    };

    expectToMatchScreen = async (tag: string, acceptableMismatch = 5) => {
        await expect((await driver.compareScreen(tag)).misMatchPercentage).toBeLessThanOrEqual(acceptableMismatch);
    };
}

export default AndroidRunner;

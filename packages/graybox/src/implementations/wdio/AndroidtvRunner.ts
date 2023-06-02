import AbstractRunner from './AbstractRunner';
import { pressButtonAndroid } from './helpers';

class AndroidtvRunner extends AbstractRunner {
    launchApp = () => {
        // do nothing
    };

    getElementById = (selector: string) => {
        return $(`~${selector}`);
    };

    getElementByText = (selector: string) => {
        return $(`[text="${selector}"]`);
    };

    scrollById = () => {
        // do nothing
    };

    clickById = () => {
        // do nothing
    };

    clickByText = () => {
        // do nothing
    };

    pressButtonHome = async (n: number) => {
        await pressButtonAndroid(n, 3);
    };

    pressButtonBack = async (n: number) => {
        await pressButtonAndroid(n, 4);
    };

    pressButtonUp = async (n: number) => {
        await pressButtonAndroid(n, 19);
    };

    pressButtonDown = async (n: number) => {
        await pressButtonAndroid(n, 20);
    };

    pressButtonLeft = async (n: number) => {
        await pressButtonAndroid(n, 21);
    };

    pressButtonRight = async (n: number) => {
        await pressButtonAndroid(n, 22);
    };

    pressButtonSelect = async (n: number) => {
        await pressButtonAndroid(n, 23);
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

export default AndroidtvRunner;

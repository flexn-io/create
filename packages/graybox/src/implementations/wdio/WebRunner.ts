import AbstractRunner from './AbstractRunner';

class WebRunner extends AbstractRunner {
    launchApp = async () => {
        await browser.url('/');
    };

    getElementById = async (selector: string) => {
        const array = await $$(`[data-testid="${selector}"]`);
        if (array.length <= 1) {
            return $(`[data-testid="${selector}"]`);
        } else {
            for (const element of array) {
                const isDisplayed = await element.isDisplayed();
                if (isDisplayed) {
                    return element;
                }
            }
        }
    };

    getElementByText = async (selector: string) => {
        const array = await $$(`//*[text()='${selector}']`);
        if (array.length <= 1) {
            return $(`//*[text()='${selector}']`);
        } else {
            for (const element of array) {
                const isDisplayed = await element.isDisplayed();
                if (isDisplayed) {
                    return element;
                }
            }
        }
    };

    scrollById = async (selector: string) => {
        const element = await this.getElementById(selector);
        if (element) {
            await element.scrollIntoView();
        }
    };

    clickById = async (selector: string) => {
        const element = await this.getElementById(selector);
        if (element) {
            await element.click();
        }
    };

    clickByText = async (selector: string) => {
        const element = await this.getElementByText(selector);
        if (element) {
            await element.click();
        }
    };

    pressButtonHome = () => {
        // do nothing
    };

    pressButtonBack = async (n: number) => {
        const promises = [];
        for (let i = 0; i < n; i++) {
            promises[i] = browser.back();
        }
        await Promise.all(promises);
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
        if (element) {
            await element.waitForDisplayed({ timeout: 60000 });
            await expect(await browser.checkElement(element, tag)).toBeLessThanOrEqual(acceptableMismatch);
        }
    };

    expectToMatchElementByText = async (selector: string, tag: string, acceptableMismatch = 5) => {
        const element = await this.getElementByText(selector);
        if (element) {
            await element.waitForDisplayed({ timeout: 60000 });
            await expect(await browser.checkElement(element, tag)).toBeLessThanOrEqual(acceptableMismatch);
        }
    };

    expectToMatchScreen = async (tag: string, acceptableMismatch = 5) => {
        await expect(await browser.checkScreen(tag)).toBeLessThanOrEqual(acceptableMismatch);
    };
}

export default WebRunner;

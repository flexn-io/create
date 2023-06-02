import AbstractRunner from './AbstractRunner';

class MacosElectronRunner extends AbstractRunner {
    launchApp = () => {
        // do nothing
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

    pressButtonBack = () => {
        // do nothing
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

export default MacosElectronRunner;

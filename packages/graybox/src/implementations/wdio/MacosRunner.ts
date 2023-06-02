import AbstractRunner from './AbstractRunner';

class MacosRunner extends AbstractRunner {
    launchApp = () => {
        // do nothing
    };

    getElementById = (selector: string) => {
        return $(`~${selector}`);
    };

    getElementByText = (selector: string) => {
        return $(`[name="${selector}"]`);
    };

    scrollById = async (selectorTo: string, direction: string, selectorFrom: string) => {
        const elementFrom = await this.getElementById(selectorFrom);
        const elementTo = await this.getElementById(selectorTo);
        const frameFrom = (await elementFrom.getAttribute('frame')) as unknown as {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        const frameTo = (await elementTo.getAttribute('frame')) as unknown as {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        const scrollX = frameFrom.x - frameTo.x;
        const scrollY = frameFrom.y - frameTo.y;
        await browser.execute('macos: scroll', { elementId: elementFrom, deltaX: scrollX, deltaY: scrollY });
    };

    clickById = async (selector: string) => {
        await (await this.getElementById(selector)).click();
    };

    clickByText = async (selector: string) => {
        await (await this.getElementByText(selector)).click();
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
        const element = await this.getElementById('SceneWindow');
        await element.waitForDisplayed({ timeout: 60000 });
        await expect((await driver.compareElement(element, tag)).misMatchPercentage).toBeLessThanOrEqual(
            acceptableMismatch
        );
    };
}

export default MacosRunner;

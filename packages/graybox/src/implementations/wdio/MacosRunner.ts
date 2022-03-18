import AbstractRunner from './AbstractRunner';

class MacosRunner extends AbstractRunner {
    launchApp = () => {
        // do nothing.
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
        let isDisplayed = await elementTo.isDisplayed();
        console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAA', isDisplayed);
        while (!isDisplayed) {
            if (direction === 'down') {
                await browser.execute('macos: scroll', { elementId: elementFrom, deltaX: 0, deltaY: -100 });
                console.log('DOWN/DOWN/DOWN/DOWN/DOWN/DOWN/DOWN/DOWN/DOWN/DOWN/DOWN/DOWN/DOWN/DOWN/DOWN/DOWN/');
            }
            else if (direction === 'up') {
                await browser.execute('macos: scroll', { elementId: elementFrom, deltaX: 0, deltaY: 100 });
            }
            else if (direction === 'left') {
                await browser.execute('macos: scroll', { elementId: elementFrom, deltaX: -100, deltaY: 0 });
            }
            else if (direction === 'right') {
                await browser.execute('macos: scroll', { elementId: elementFrom, deltaX: 100, deltaY: 0 });
            }
            isDisplayed = await elementTo.isDisplayed();
        }
    };

    clickById = async (selector: string) => {
        await (await this.getElementById(selector)).click();
    };

    clickByText = async (selector: string) => {
        await (await this.getElementByText(selector)).click();
    };

    pressButtonHome = () => {
        // do nothing.
    };

    pressButtonBack = () => {
        // do nothing.
    };

    pressButtonUp = () => {
        // do nothing.
    };

    pressButtonDown = () => {
        // do nothing.
    };

    pressButtonLeft = () => {
        // do nothing.
    };

    pressButtonRight = () => {
        // do nothing.
    };

    pressButtonSelect = () => {
        // do nothing.
    };
}

export default MacosRunner;

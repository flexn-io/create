import AbstractRunner from './AbstractRunner';

class WebRunner extends AbstractRunner {
    launchApp = async () => {
        await browser.url('/');
    };

    getElementById = (selector: string) => {
        return $(`[data-testid="${selector}"]`);
    };

    getElementByText = (selector: string) => {
        return $(`div=${selector}`);
    };

    scrollById = async (selector: string) => {
        await (await this.getElementById(selector)).scrollIntoView();
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

    pressButtonBack = async (n: number) => {
        const promises = [];
        for (let i = 0; i < n; i++) {
            promises[i] = browser.back();
        }
        await Promise.all(promises);
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

export default WebRunner;

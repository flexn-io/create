import type ExpectWebdriverIO from 'expect-webdriverio';

abstract class AbstractRunner {
    // launch app
    abstract launchApp(): void;

    // select
    abstract getElementById(selector: string): any;

    abstract getElementByText(selector: string): any;

    // scroll
    abstract scrollById(selectorFrom: string, direction: string, selectorTo: string): void;

    // click
    abstract clickById(selector: string): void;

    abstract clickByText(selector: string): void;

    // press button
    abstract pressButtonHome(n: number): void;

    abstract pressButtonBack(n: number): void;

    abstract pressButtonUp(n: number): void;

    abstract pressButtonDown(n: number): void;

    abstract pressButtonLeft(n: number): void;

    abstract pressButtonRight(n: number): void;

    abstract pressButtonSelect(n: number): void;

    // expect toBeExisting
    expectToBeExistingById = async (selector: string) => {
        await expect<ExpectWebdriverIO.Expect>(await this.getElementById(selector)).toBeExisting();
    };

    expectToBeExistingByText = async (selector: string) => {
        await expect<ExpectWebdriverIO.Expect>(await this.getElementByText(selector)).toBeExisting();
    };

    // expect toBeDisplayed
    expectToBeDisplayedById = async (selector: string) => {
        await expect<ExpectWebdriverIO.Expect>(await this.getElementById(selector)).toBeDisplayed();
    };

    expectToBeDisplayedByText = async (selector: string) => {
        await expect<ExpectWebdriverIO.Expect>(await this.getElementByText(selector)).toBeDisplayed();
    };

    // expect toBeClickable
    expectToBeClickableById = async (selector: string) => {
        await expect<ExpectWebdriverIO.Expect>(await this.getElementById(selector)).toBeClickable();
    };

    expectToBeClickableByText = async (selector: string) => {
        await expect<ExpectWebdriverIO.Expect>(await this.getElementByText(selector)).toBeClickable();
    };

    // expect toHaveText
    expectToHaveTextById = async (selector: string, text: string) => {
        await expect<ExpectWebdriverIO.Expect>(await this.getElementById(selector)).toHaveText(text);
    };

    // waitForDisplayed
    waitForDisplayedById = async (selector: string, timeout = 60000) => {
        await (await this.getElementById(selector)).waitForDisplayed({ timeout });
    };

    waitForDisplayedByText = async (selector: string, timeout = 60000) => {
        await (await this.getElementByText(selector)).waitForDisplayed({ timeout });
    };

    // waitForExist
    waitForExistById = async (selector: string, timeout = 60000) => {
        await (await this.getElementById(selector)).waitForExist({ timeout });
    };

    waitForExistByText = async (selector: string, timeout = 60000) => {
        await (await this.getElementByText(selector)).waitForExist({ timeout });
    };

    // waitForClickable
    waitForClickableById = async (selector: string, timeout = 60000) => {
        await (await this.getElementById(selector)).waitForClickable({ timeout });
    };

    waitForClickableByText = async (selector: string, timeout = 60000) => {
        await (await this.getElementByText(selector)).waitForClickable({ timeout });
    };

    // setValue
    setValueById = async (selector: string, value: string) => {
        await (await this.getElementById(selector)).setValue(value);
    };

    // clearValue
    clearValueById = async (selector: string) => {
        await (await this.getElementById(selector)).clearValue();
    };

    // pause
    pause = async (time: number) => {
        await browser.pause(time);
    };

    // gherkin
    GIVEN = (message: string) => {
        //eslint-disable-next-line
        console.log(`GIVEN: ${message}`);
    };

    WHEN = (message: string) => {
        //eslint-disable-next-line
        console.log(`WHEN: ${message}`);
    };

    THEN = (message: string) => {
        //eslint-disable-next-line
        console.log(`THEN: ${message}`);
    };
}

export default AbstractRunner;

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
}

export default AndroidtvRunner;

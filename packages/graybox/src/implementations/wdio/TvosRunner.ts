import AbstractRunner from './AbstractRunner';
import { pressButtonIos } from './helpers';

class TvosRunner extends AbstractRunner {
    launchApp = () => {
        // do nothing
    };

    getElementById = (selector: string) => {
        return $(`~${selector}`);
    };

    getElementByText = (selector: string) => {
        return $(`[label="${selector}"]`);
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
        await pressButtonIos(n, 'home');
    };

    pressButtonBack = async (n: number) => {
        await pressButtonIos(n, 'menu');
    };

    pressButtonUp = async (n: number) => {
        await pressButtonIos(n, 'up');
    };

    pressButtonDown = async (n: number) => {
        await pressButtonIos(n, 'down');
    };

    pressButtonLeft = async (n: number) => {
        await pressButtonIos(n, 'left');
    };

    pressButtonRight = async (n: number) => {
        await pressButtonIos(n, 'right');
    };

    pressButtonSelect = async (n: number) => {
        await pressButtonIos(n, 'select');
    };
}

export default TvosRunner;

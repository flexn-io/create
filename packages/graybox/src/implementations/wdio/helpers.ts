/* eslint-disable no-await-in-loop */
// const pressButtonAndroid = async (n: number, keyCode: number) => {
//     for (let i = 0; i < n; i++) {
//         await driver.pressKeyCode(keyCode);
//         // await browser.pause(500);
//     }
// };

const pressButtonAndroid = async (n: number, keyCode: number) => {
    const promises = [];
    for (let i = 0; i < n; i++) {
        promises[i] = driver.pressKeyCode(keyCode);
    }
    await Promise.all(promises);
};

const pressButtonIos = async (n: number, name: string) => {
    const promises = [];
    for (let i = 0; i < n; i++) {
        promises[i] = browser.execute('mobile: pressButton', { name });
    }
    await Promise.all(promises);
};

export { pressButtonAndroid, pressButtonIos };

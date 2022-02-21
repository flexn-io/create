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

const FlexnRunner = require('@flexn/graybox').default;

describe('Harness app Grid test', () => {
    before(() => {
        FlexnRunner.launchApp();
    });

    it('focus on grid test', async () => {
        await FlexnRunner.pause(2000);
        await FlexnRunner.pressButtonRight(2);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'home-G1');
    });

    it('open grid test', async () => {
        await FlexnRunner.pressButtonSelect(1);
        await FlexnRunner.expectToBeDisplayedByText('#G1 ');
    });

    it('focus on first grid item', async () => {
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'G1-0');
    });

    it('focus remains on first item after clicking left', async () => {
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'G1-0');
    });

    it('focus remains on first item after clicking up', async () => {
        await FlexnRunner.pressButtonUp(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'G1-0');
    });

    it('scroll first row to the end', async () => {
        for (let i = 1; i <= 4; i++) {
            await FlexnRunner.pressButtonRight(1);
            await FlexnRunner.expectToHaveTextById('focused-element-selector', `G1-${i}`);
        }
    });

    it('focus remains on last column after clicking right', async () => {
        await FlexnRunner.pressButtonRight(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector','G1-4');
    });

    it('focus remains on last column after clicking up', async () => {
        await FlexnRunner.pressButtonUp(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector','G1-4');
    });

    it('check grid diagonally to the left and down', async () => {
        const element = await FlexnRunner.getElementById('focused-element-selector');
        for (let i = 2; i < 6; i++) {
            await FlexnRunner.pressButtonLeft(1);
            await FlexnRunner.pressButtonDown(1);
            await expect(element).toHaveText(`G1-${i*4}`);
        }
    });
   
    it('scroll first column down', async () => {
        const element = await FlexnRunner.getElementById('focused-element-selector');
        for (let i = 25; i <= 50 ; i+=5) {
            await FlexnRunner.pressButtonDown(1);
            await expect(element).toHaveText(`G1-${i}`);
        }
    });

    it('check grid diagonally to the right and down', async () => {
        const element = await FlexnRunner.getElementById('focused-element-selector');
        for (let i = 56; i <= 74; i+=6) {
            await FlexnRunner.pressButtonRight(1);
            await FlexnRunner.pressButtonDown(1);
            await expect(element).toHaveText(`G1-${i}`);
        }
    });

    it('focus remains on last item after clicking down', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'G1-74');
    });

    it('focus remains on last item after clicking right', async () => {
        await FlexnRunner.pressButtonRight(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'G1-74');
    });

    it('Scroll last row to the beginning', async () => {
        const element = await FlexnRunner.getElementById('focused-element-selector');
        for (let i = 74; i > 70 ; i--) {
            await FlexnRunner.pressButtonLeft(1);
            await expect(element).toHaveText(`G1-${i-1}`);
        }
    });
    
    it('focus remains on first column after clicking left', async () => {
        await FlexnRunner.pressButtonLeft(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'G1-70');
    });

    it('focus remains on first column after clicking down', async () => {
        await FlexnRunner.pressButtonDown(1);
        await FlexnRunner.expectToHaveTextById('focused-element-selector', 'G1-70');
    });

    it('check grid diagonally to the right and up', async () => {
        const element = await FlexnRunner.getElementById('focused-element-selector');
        for (let i = 66; i >= 54; i-=4) {
            await FlexnRunner.pressButtonRight(1);
            await FlexnRunner.pressButtonUp(1);
            await expect(element).toHaveText(`G1-${i}`);
        }
    });

    it('scroll last column up', async () => {
        const element = await FlexnRunner.getElementById('focused-element-selector');
        for (let i = 49; i >= 24 ; i-=5) {
            await FlexnRunner.pressButtonUp(1);
            await expect(element).toHaveText(`G1-${i}`);
        }
    });

    it('check grid diagonally to the left and up', async () => {
        const element = await FlexnRunner.getElementById('focused-element-selector');
        for (let i = 18; i >= 0; i-=6) {
            await FlexnRunner.pressButtonLeft(1);
            await FlexnRunner.pressButtonUp(1);
            await expect(element).toHaveText(`G1-${i}`);
        }
    });
});
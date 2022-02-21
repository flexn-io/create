// import runner from '../index';

// eslint-disable-next-line
console.log = jest.fn();

describe('Test Case 1', () => {
    it('Test 1', () => {
        // runner.foo();
        // eslint-disable-next-line
        console.log('TEST');
        // eslint-disable-next-line
        expect(console.log).toBeCalled();
    });
});



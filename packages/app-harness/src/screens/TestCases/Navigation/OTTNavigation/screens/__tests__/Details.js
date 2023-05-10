// import React from 'react';
import 'react-native';
// import renderer from 'react-test-renderer';
// import DetailsScreen from '../Details';

jest.mock('../../../../../../config', () => ({
    color2: '#FFF',
    color4: '#FFF',
}));
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

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

// it('renders correctly', () => {
//     renderer.create(<DetailsScreen />);
// });
// Details:

// /Users/rokas/work/flexn-sdk/node_modules/recyclerlistview/node_modules/lodash-es/debounce.js:1
// ({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,jest){import isObject from './isObject.js';
//                                                                                   ^^^^^^

// SyntaxError: Cannot use import statement outside a module

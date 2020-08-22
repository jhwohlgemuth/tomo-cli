import {isEmptyString} from '../src/utils/common.js';

describe('Common utilities', () => {
    test('isEmptyString function', () => {
        expect(isEmptyString('')).toBe(true);
        expect(isEmptyString('not empty')).toBe(false);
        expect(isEmptyString(2)).toBe(false);
    });
});
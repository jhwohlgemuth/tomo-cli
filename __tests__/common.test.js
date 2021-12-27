import {
    appendToObjectValues,
    isEmptyString
} from '../src/utils/common.js';

describe('Common utilities', () => {
    test('isEmptyString function', () => {
        expect(isEmptyString('')).toBe(true);
        expect(isEmptyString('not empty')).toBe(false);
        expect(isEmptyString(2)).toBe(false);
    });
    test('appendToObjectValues', () => {
        const obj = {
            a: ['a'],
            b: ['b'],
            c: ['c']
        };
        const result = {
            a: ['a', 'x'],
            b: ['b', 'x'],
            c: ['c', 'x']
        };
        expect(appendToObjectValues(obj, 'x')).toEqual(result);
    });
});
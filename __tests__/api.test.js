import * as api from '../src/api';

describe('API', () => {
    test('exports API', () => {
        expect(Object.keys(api)).toMatchSnapshot();
    });
});
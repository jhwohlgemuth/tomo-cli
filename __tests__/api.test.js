import api from '../src/api';

describe('API', () => {
    test('exports utils', () => {
        expect(Object.keys(api)).toMatchSnapshot();
    });
});
const delay = duration => new Promise(resolve => {
    setTimeout(resolve, duration);
});

describe('Example', () => {
    test('can pass', () => {
        expect(1).toEqual(1);
        expect(1).not.toEqual(0);
    });
    test('can pass asynchronously', async () => {
        await delay(100);
        expect(1).toEqual(1);
    });
});
import React from 'react';
import isOnline from 'is-online';
import {render} from 'ink-testing-library';
import {OfflineWarning, TaskList} from '../src/ui';

jest.mock('is-online', () => (async () => false));

xdescribe('Offline warning', () => {
    const ORIGINAL_CONSOLE_ERROR = console.error;//eslint-disable-line no-console
    beforeAll(() => {
        console.error = jest.fn();//eslint-disable-line no-console
    });
    afterAll(() => {
        console.error = ORIGINAL_CONSOLE_ERROR;//eslint-disable-line no-console
    });
    test('is-online returns false (for testing)', async () => {
        const result = await isOnline();
        expect(result).toEqual(false);
    });
    test('can render', async () => {
        const {lastFrame} = render(<OfflineWarning/>);
        expect(lastFrame()).toMatchSnapshot();
    });
    test('does not render when offline and skipInstall === true', done => {
        const options = {skipInstall: true};
        const {lastFrame} = render(<TaskList command={'add'} terms={['babel']} options={options} done={complete}></TaskList>);
        function complete() {
            expect(lastFrame()).toMatchSnapshot();
            done();
        }
    });
    test('renders when offline and skipInstall === false', done => {
        const options = {skipInstall: false};
        const {lastFrame} = render(<TaskList command={'add'} terms={['babel']} options={options} done={complete}></TaskList>);
        function complete() {
            expect(lastFrame()).toMatchSnapshot();
            done();
        }
    });
});
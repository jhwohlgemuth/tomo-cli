import React from 'react';
import isOnline from 'is-online';
import {render} from 'ink-testing-library';
import {useTemporaryDirectory} from './tomo-test';
import {OfflineWarning, TaskList} from '../src/components';
import commands from '../src/commands';

jest.mock('is-online', () => (async () => false));

describe('Offline warning', () => {
    let tempDirectory;
    const ORIGINAL_CONSOLE_ERROR = console.error;//eslint-disable-line no-console
    const [setTempDir, cleanupTempDir] = useTemporaryDirectory();
    beforeEach(async () => {
        tempDirectory = await setTempDir();
        process.chdir(tempDirectory);
    });
    afterEach(async () => {
        await cleanupTempDir();
    });
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
        const {lastFrame} = render(<TaskList command={'add'} commands={commands} terms={['babel']} options={options} done={complete}></TaskList>);
        function complete() {
            expect(lastFrame()).toMatchSnapshot();
            done();
        }
    });
    test('renders when offline and skipInstall === false', done => {
        const options = {skipInstall: false};
        const {lastFrame} = render(<TaskList command={'add'} commands={commands} terms={['babel']} options={options} done={complete}></TaskList>);
        function complete() {
            expect(lastFrame()).toMatchSnapshot();
            done();
        }
    });
});
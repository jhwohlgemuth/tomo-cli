import {useTemporaryDirectory} from './tomo-test';
import React from 'react';
import {render} from 'ink-testing-library';
import {descriptions} from '../src/cli';
import UI from '../src/main';

jest.mock('is-online', () => (async () => true));

const ARROW_DOWN = '\u001B[B';

describe('tomo interface', () => {
    let tempDirectory;
    const skipInstall = true;
    const [setTempDir, cleanupTempDir] = useTemporaryDirectory();
    const ORIGINAL_CONSOLE_ERROR = console.error;//eslint-disable-line no-console
    beforeAll(() => {
        console.error = jest.fn();//eslint-disable-line no-console
    });
    afterAll(() => {
        console.error = ORIGINAL_CONSOLE_ERROR;//eslint-disable-line no-console
    });
    beforeEach(async () => {
        tempDirectory = await setTempDir();
        process.chdir(tempDirectory);
    });
    afterEach(async () => {
        await cleanupTempDir();
    });
    test('add', () => {
        const input = ['add'];
        const {lastFrame, stdin} = render(<UI descriptions={descriptions} input={input} flags={{skipInstall}}/>);
        expect(lastFrame()).toMatchSnapshot();
        stdin.write(ARROW_DOWN);
        expect(lastFrame()).toMatchSnapshot();
    });
    test('remove', () => {
        const input = ['remove'];
        const {lastFrame, stdin} = render(<UI input={input} flags={{skipInstall}} />);
        expect(lastFrame()).toMatchSnapshot();
        stdin.write(ARROW_DOWN);
        expect(lastFrame()).toMatchSnapshot();
    });
    xtest('add eslint', done => {
        const input = ['add', 'eslint'];
        const flags = {skipInstall};
        const {lastFrame} = render(<UI input={input} flags={flags} done={complete}/>);
        function complete() {
            expect(lastFrame()).toMatchSnapshot();
            done();
        }
    });
    xtest('add eslint --use-react', done => {
        const input = ['add', 'eslint'];
        const flags = {useReact: true, skipInstall};
        const {lastFrame} = render(<UI input={input} flags={flags} done={complete}/>);
        function complete() {
            expect(lastFrame()).toMatchSnapshot();
            done();
        }
    });
});

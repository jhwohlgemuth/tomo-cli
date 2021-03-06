import {useTemporaryDirectory} from './tomo-test';
import React from 'react';
import {render} from 'ink-testing-library';
import {descriptions} from '../src/cli';
import commands from '../src/commands';
import Main from '../src/components/main';

jest.mock('is-online', () => (async () => true));

const ARROW_DOWN = '\u001B[B';

describeOnlyOnLinux('tomo interface', () => {
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
        const {lastFrame, stdin} = render(<Main
            commands={commands}
            descriptions={descriptions}
            input={input}
            flags={{skipInstall}}
            namespace={'tomo-testing'}/>);
        expect(lastFrame()).toMatchSnapshot();
        stdin.write(ARROW_DOWN);
        expect(lastFrame()).toMatchSnapshot();
    });
    test('remove', () => {
        const input = ['remove'];
        const {lastFrame, stdin} = render(<Main
            commands={commands}
            descriptions={descriptions}
            input={input}
            flags={{skipInstall}}
            namespace={'tomo-testing'}/>);
        expect(lastFrame()).toMatchSnapshot();
        stdin.write(ARROW_DOWN);
        expect(lastFrame()).toMatchSnapshot();
    });
    xtest('add eslint', done => {
        const input = ['add', 'eslint'];
        const flags = {skipInstall};
        const {lastFrame} = render(<Main input={input} flags={flags} done={complete}/>);
        function complete() {
            expect(lastFrame()).toMatchSnapshot();
            done();
        }
    });
    xtest('add eslint --use-react', done => {
        const input = ['add', 'eslint'];
        const flags = {useReact: true, skipInstall};
        const {lastFrame} = render(<Main input={input} flags={flags} done={complete}/>);
        function complete() {
            expect(lastFrame()).toMatchSnapshot();
            done();
        }
    });
});

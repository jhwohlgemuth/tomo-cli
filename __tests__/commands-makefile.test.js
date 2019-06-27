import {readMakefileContent, run, useTemporaryDirectory} from './tomo-test';
import commands from '../src/commands';
import addMakefile from '../src/commands/add-makefile';

jest.mock('is-online', () => (async () => true));

describe('Makefile', () => {
    let tempDirectory;
    const [setTempDir, cleanupTempDir] = useTemporaryDirectory();
    beforeEach(async () => {
        tempDirectory = await setTempDir();
        process.chdir(tempDirectory);
    });
    afterEach(async () => {
        await cleanupTempDir();
    });
    test('Add support (create empty Makefile)', async () => {
        await run(addMakefile, {});
        const makefile = readMakefileContent();
        expect(makefile).toMatchSnapshot();
    });
    test('Add support (import tasks from package.json)', async () => {
        const {create} = commands;
        const options = {
            skipInstall: true,
            outputDirectory: './dist',
            sourceDirectory: './src'
        };
        await run(create.app, options);
        await run(addMakefile, {});
        const makefile = readMakefileContent();
        expect(makefile).toMatchSnapshot();
    });
});
import {
    fileContents,
    getDirectoryTree,
    run,
    useTemporaryDirectory
} from './tomo-test';
import {
    createPackageJson,
    createSourceDirectory
} from '../src/commands/common';
import commands from '../src/commands';

jest.mock('is-online', () => (async () => true));

describe('"Create/New" commands', () => {
    let tempDirectory;
    const skipInstall = true;
    const {create} = commands;
    const [setTempDir, cleanupTempDir] = useTemporaryDirectory();
    beforeEach(async () => {
        tempDirectory = await setTempDir();
        process.chdir(tempDirectory);
    });
    afterEach(async () => {
        await cleanupTempDir();
    });
    test('create package.json', async () => {
        await run(createPackageJson, {});
        const contents = fileContents('./package.json');
        expect(contents).toMatchSnapshot();
    });
    test('create source directory', async () => {
        const sourceDirectory = 'some-random-folder-name';
        await run(createSourceDirectory, {sourceDirectory});
        const tree = getDirectoryTree(tempDirectory);
        expect(tree).toMatchSnapshot();
    });
    test('create new project', async () => {
        const sourceDirectory = 'src';
        const options = {skipInstall, sourceDirectory};
        await run(create.project, options);
        const tree = getDirectoryTree(tempDirectory);
        expect(tree).toMatchSnapshot();
    });
    test('create new app', async () => {
        const sourceDirectory = 'src';
        const outputDirectory = './dist';
        const options = {outputDirectory, skipInstall, sourceDirectory};
        await run(create.app, options);
        const tree = getDirectoryTree(tempDirectory);
        const pkg = fileContents('package.json');
        const cfg = fileContents('.eslintrc.js');
        expect(tree).toMatchSnapshot();
        expect(pkg).toMatchSnapshot();
        expect(cfg).toMatchSnapshot();
    });
    test('create new react app', async () => {
        const reactVersion = '16.2';
        const sourceDirectory = 'src';
        const outputDirectory = './dist';
        const useReact = true;
        const options = {outputDirectory, reactVersion, skipInstall, sourceDirectory, useReact};
        await run(create.app, options);
        const tree = getDirectoryTree(tempDirectory);
        const pkg = fileContents('package.json');
        const cfg = fileContents('.eslintrc.js');
        expect(tree).toMatchSnapshot();
        expect(pkg).toMatchSnapshot();
        expect(cfg).toMatchSnapshot();
    });
    test('create new server', async () => {
        const options = {skipInstall};
        await run(create.server, options);
        const tree = getDirectoryTree(tempDirectory);
        const pkg = fileContents('package.json');
        const cfg = fileContents('.eslintrc.js');
        expect(tree).toMatchSnapshot();
        expect(pkg).toMatchSnapshot();
        expect(cfg).toMatchSnapshot();
    });
});
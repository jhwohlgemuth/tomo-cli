import {fileContents, getDirectoryTree, run, useTemporaryDirectory} from './tomo-test';
import {createPackageJson, createSourceDirectory} from '../src/commands/common';
import commands from '../src/commands';

jest.mock('is-online', () => (async () => true));

describe('Create', () => {
    let tempDirectory;
    const skipInstall = true;
    const outputDirectory = './dist';
    const sourceDirectory = './src';
    const useReact = true;
    const reactVersion = '16.2';
    const {create} = commands;
    const omit = ['extension', 'path', 'size', 'type'];
    const [setTempDir, cleanupTempDir] = useTemporaryDirectory();
    beforeEach(async () => {
        tempDirectory = await setTempDir();
        process.chdir(tempDirectory);
    });
    afterEach(async () => {
        await cleanupTempDir();
    });
    test('package.json', async () => {
        await run(createPackageJson, {});
        const contents = fileContents('./package.json');
        expect(contents).toMatchSnapshot();
    });
    test('source directory', async () => {
        const sourceDirectory = 'some-random-folder-name';
        await run(createSourceDirectory, {sourceDirectory});
        const tree = getDirectoryTree(tempDirectory, {omit});
        expect(tree).toMatchSnapshot();
    });
    test('new project', async () => {
        const options = {skipInstall, sourceDirectory};
        await run(create.project, options);
        const tree = getDirectoryTree(tempDirectory, {omit});
        expect(tree).toMatchSnapshot();
    });
    test('new app', async () => {
        const options = {outputDirectory, skipInstall, sourceDirectory};
        await run(create.app, options);
        const tree = getDirectoryTree(tempDirectory, {omit});
        const pkg = fileContents('./package.json');
        const cfg = fileContents('./.eslintrc.js');
        expect(tree).toMatchSnapshot();
        expect(pkg).toMatchSnapshot();
        expect(cfg).toMatchSnapshot();
    });
    test('new react app', async () => {
        const options = {outputDirectory, reactVersion, skipInstall, sourceDirectory, useReact};
        await run(create.app, options);
        const tree = getDirectoryTree(tempDirectory, {omit});
        const pkg = fileContents('./package.json');
        const cfg = fileContents('./.eslintrc.js');
        expect(tree).toMatchSnapshot();
        expect(pkg).toMatchSnapshot();
        expect(cfg).toMatchSnapshot();
    });
    test('new server', async () => {
        const options = {skipInstall};
        await run(create.server, options);
        const tree = getDirectoryTree(tempDirectory, {omit});
        const pkg = fileContents('./package.json');
        const cfg = fileContents('./.eslintrc.js');
        expect(tree).toMatchSnapshot();
        expect(pkg).toMatchSnapshot();
        expect(cfg).toMatchSnapshot();
    });
});
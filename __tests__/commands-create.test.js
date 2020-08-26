import {fileContents, getDirectoryTree, run, useTemporaryDirectory} from './tomo-test';
import commands from '../src/commands';

jest.mock('is-online', () => (async () => true));

describeOnlyOnLinux('Create', () => {
    let tempDirectory;
    const skipInstall = true;
    const useReact = true;
    const withRust = true;
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
    test('new project', async () => {
        await run(create.project, {skipInstall});
        const tree = getDirectoryTree(tempDirectory, {omit});
        const config = fileContents('./.editorconfig');
        expect(tree).toMatchSnapshot();
        expect(config).toMatchSnapshot();
    });
    test('new app', async () => {
        await run(create.app, {skipInstall});
        const tree = getDirectoryTree(tempDirectory, {omit});
        const pkg = fileContents('./package.json');
        const cfg = fileContents('./.eslintrc.js');
        expect(tree).toMatchSnapshot();
        expect(pkg).toMatchSnapshot();
        expect(cfg).toMatchSnapshot();
    });
    test('new react app', async () => {
        const options = {reactVersion, skipInstall, useReact};
        await run(create.app, options);
        const tree = getDirectoryTree(tempDirectory, {omit});
        const pkg = fileContents('./package.json');
        const cfg = fileContents('./.eslintrc.js');
        expect(tree).toMatchSnapshot();
        expect(pkg).toMatchSnapshot();
        expect(cfg).toMatchSnapshot();
    });
    test('new react app (with Rust)', async () => {
        const options = {reactVersion, skipInstall, useReact, withRust};
        await run(create.app, options);
        const tree = getDirectoryTree(tempDirectory, {omit});
        expect(tree).toMatchSnapshot();
    });
    test('new server', async () => {
        await run(create.server, {skipInstall});
        const tree = getDirectoryTree(tempDirectory, {omit});
        const pkg = fileContents('./package.json');
        const cfg = fileContents('./.eslintrc.js');
        expect(tree).toMatchSnapshot();
        expect(pkg).toMatchSnapshot();
        expect(cfg).toMatchSnapshot();
    });
});
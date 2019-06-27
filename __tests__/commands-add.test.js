import {
    fileContents,
    getDirectoryTree,
    run,
    useTemporaryDirectory
} from './tomo-test';
import {createPackageJson} from '../src/commands/common';
import addEsdoc from '../src/commands/add-esdoc';
import addEslint from '../src/commands/add-eslint';
// import addRust from '../src/commands/add-rust';
import addMarionette from '../src/commands/add-marionette';
import {addReason} from '../src/commands/add-reason';

jest.mock('is-online', () => (async () => true));

describe('"Add" commands', () => {
    let tempDirectory;
    const skipInstall = true;
    const useReact = true;
    const [setTempDir, cleanupTempDir] = useTemporaryDirectory();
    beforeEach(async () => {
        tempDirectory = await setTempDir();
        process.chdir(tempDirectory);
    });
    afterEach(async () => {
        await cleanupTempDir();
    });
    test('add-esdoc', async () => {
        const sourceDirectory = 'src';
        const options = {skipInstall, sourceDirectory};
        await run(createPackageJson, {});
        const pre = fileContents('./package.json');
        expect(pre).toMatchSnapshot();
        await run(addEsdoc, options);
        const tree = getDirectoryTree(tempDirectory);
        expect(tree).toMatchSnapshot();
        const post = fileContents('./package.json');
        expect(post).toMatchSnapshot();
        const contents = fileContents('./esdoc.conf.json');
        expect(contents).toMatchSnapshot();
    });
    test('add-esdoc (with React)', async () => {
        const sourceDirectory = 'src';
        const options = {skipInstall, sourceDirectory, useReact};
        await run(addEsdoc, options);
        const tree = getDirectoryTree(tempDirectory);
        expect(tree).toMatchSnapshot();
        const contents = fileContents('./esdoc.conf.json');
        expect(contents).toMatchSnapshot();
    });
    test('add-eslint', async () => {
        const sourceDirectory = 'src';
        const options = {skipInstall, sourceDirectory};
        await run(addEslint, options);
        const tree = getDirectoryTree(tempDirectory);
        expect(tree).toMatchSnapshot();
        const contents = fileContents('./.eslintrc.js');
        expect(contents).toMatchSnapshot();
    });
    test('add-eslint (with React)', async () => {
        const reactVersion = '16.2';
        const sourceDirectory = './src';
        const options = {reactVersion, skipInstall, sourceDirectory, useReact};
        await run(addEslint, options);
        const tree = getDirectoryTree(tempDirectory);
        expect(tree).toMatchSnapshot();
        const contents = fileContents('./.eslintrc.js');
        expect(contents).toMatchSnapshot();
    });
    test('add-marionette', async () => {
        const sourceDirectory = './src';
        const options = {skipInstall, sourceDirectory};
        await run(addMarionette, options);
        const tree = getDirectoryTree(tempDirectory);
        expect(tree).toMatchSnapshot();
    });
});
describe('Add Reason', () => {
    let tempDirectory;
    const outputDirectory = './dist';
    const sourceDirectory = 'src';
    const useReact = true;
    const skipInstall = true;
    const [setTempDir, cleanupTempDir] = useTemporaryDirectory();
    beforeEach(async () => {
        tempDirectory = await setTempDir();
        process.chdir(tempDirectory);
    });
    afterEach(async () => {
        await cleanupTempDir();
    });
    test('with Webpack', async () => {
        const options = {outputDirectory, skipInstall, sourceDirectory, useReact};
        await run(createPackageJson, {});
        await run(addReason, options);
        const pkg = fileContents('package.json');
        const cfg = fileContents('bsconfig.json');
        const tree = getDirectoryTree(tempDirectory);
        expect(pkg).toMatchSnapshot();
        expect(cfg).toMatchSnapshot();
        expect(tree).toMatchSnapshot();
    });
});
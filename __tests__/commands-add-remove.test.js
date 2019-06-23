import {
    fileContents,
    getDirectoryTree,
    readMakefileContent,
    run,
    useTemporaryDirectory
} from './tomo-test';
import {createPackageJson} from '../src/commands/common';
import commands from '../src/commands';
import {addA11y, removeA11y} from '../src/commands/add-a11y';
import addBabel from '../src/commands/add-babel';
import {addBrowsersync, removeBrowsersync} from '../src/commands/add-browsersync';
import addElectron from '../src/commands/add-electron';
import addEsdoc from '../src/commands/add-esdoc';
import addEslint from '../src/commands/add-eslint';
import addJest from '../src/commands/add-jest';
import addMakefile from '../src/commands/add-makefile';
import {addParcel, removeParcel} from '../src/commands/add-parcel';
import {addPostcss, removePostcss} from '../src/commands/add-postcss';
// import addRust from '../src/commands/add-rust';
import addMarionette from '../src/commands/add-marionette';
import {addReason} from '../src/commands/add-reason';
import {addRollup, removeRollup} from '../src/commands/add-rollup';
import {addWebpack, removeWebpack} from '../src/commands/add-webpack';

jest.mock('is-online', () => (async () => true));

describe('"Add" commands', () => {
    let tempDirectory;
    const skipInstall = true;
    const useReact = true;
    const {create} = commands;
    const [setTempDir, cleanupTempDir] = useTemporaryDirectory();
    beforeEach(async () => {
        tempDirectory = await setTempDir();
        process.chdir(tempDirectory);
    });
    afterEach(async () => {
        await cleanupTempDir();
    });
    test('add-a11y', async () => {
        const outputDirectory = './dist';
        const options = {outputDirectory, skipInstall};
        await run(createPackageJson, {});
        await run(addA11y, options);
        const pkg = fileContents('package.json');
        expect(pkg).toMatchSnapshot();
    });
    test('add-babel', async () => {
        const sourceDirectory = 'src';
        const outputDirectory = './dist';
        const options = {outputDirectory, skipInstall, sourceDirectory};
        await run(addBabel, options);
        const tree = getDirectoryTree(tempDirectory);
        expect(tree).toMatchSnapshot();
        const contents = fileContents('./babel.config.js');
        expect(contents).toMatchSnapshot();
    });
    test('add-babel (with React)', async () => {
        const sourceDirectory = 'src';
        const outputDirectory = './dist';
        const options = {outputDirectory, skipInstall, sourceDirectory, useReact};
        await run(addBabel, options);
        const tree = getDirectoryTree(tempDirectory);
        expect(tree).toMatchSnapshot();
        const contents = fileContents('./babel.config.js');
        expect(contents).toMatchSnapshot();
    });
    test('add-browsersync', async () => {
        const sourceDirectory = 'src';
        const outputDirectory = './dist';
        const options = {outputDirectory, skipInstall, sourceDirectory};
        await run(createPackageJson, {});
        const pre = fileContents('package.json');
        await run(addBrowsersync, options);
        const noop = fileContents('package.json');
        await run(addWebpack, options);
        await run(addPostcss, options);
        await run(addBrowsersync, options);
        const post = fileContents('package.json');
        expect(pre).toMatchSnapshot();
        expect(noop).toMatchSnapshot();
        expect(post).toMatchSnapshot();
    });
    test('add-electron', async () => {
        const options = {skipInstall};
        await run(createPackageJson, {});
        await run(addElectron, options);
        const pkg = fileContents('package.json');
        const tree = getDirectoryTree(tempDirectory);
        expect(pkg).toMatchSnapshot();
        expect(tree).toMatchSnapshot();
    });
    test('add-electron --use-parcel', async () => {
        const options = {skipInstall, useParcel: true};
        await run(createPackageJson, {});
        await run(addElectron, options);
        const pkg = fileContents('package.json');
        expect(pkg).toMatchSnapshot();
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
    test('add-jest', async () => {
        const options = {skipInstall};
        await run(createPackageJson, {});
        const pre = fileContents('./package.json');
        const preTree = getDirectoryTree(tempDirectory);
        await run(addJest, options);
        const post = fileContents('./package.json');
        const postTree = getDirectoryTree(tempDirectory);
        expect(pre).toMatchSnapshot();
        expect(preTree).toMatchSnapshot();
        expect(post).toMatchSnapshot();
        expect(postTree).toMatchSnapshot();
    });
    test('add-jest --browser', async () => {
        const options = {browser: true, skipInstall};
        await run(createPackageJson, {});
        const pre = fileContents('./package.json');
        const preTree = getDirectoryTree(tempDirectory);
        await run(addJest, options);
        const post = fileContents('./package.json');
        const postTree = getDirectoryTree(tempDirectory);
        expect(pre).toMatchSnapshot();
        expect(preTree).toMatchSnapshot();
        expect(post).toMatchSnapshot();
        expect(postTree).toMatchSnapshot();
    });
    test('add-makefile', async () => {
        const sourceDirectory = './src';
        const outputDirectory = './dist';
        const options = {outputDirectory, skipInstall, sourceDirectory};
        await run(addMakefile, options);
        expect(getDirectoryTree(tempDirectory)).toMatchSnapshot();
        const pre = readMakefileContent();
        await run(create.app, options);
        await run(addMakefile, options);
        expect(getDirectoryTree(tempDirectory)).toMatchSnapshot();
        const post = readMakefileContent();
        expect(pre).toMatchSnapshot();
        expect(post).toMatchSnapshot();
    });
    test('add-marionette', async () => {
        const sourceDirectory = './src';
        const options = {skipInstall, sourceDirectory};
        await run(addMarionette, options);
        const tree = getDirectoryTree(tempDirectory);
        expect(tree).toMatchSnapshot();
    });
    test('add-parcel', async () => {
        const sourceDirectory = './src';
        const outputDirectory = './dist';
        const options = {outputDirectory, skipInstall, sourceDirectory};
        await run(createPackageJson, {});
        await run(addEslint, options);
        await run(addParcel, options);
        const contents = fileContents('./purgecss.config.js');
        const pkg = fileContents('./package.json');
        expect(contents).toMatchSnapshot();
        expect(pkg).toMatchSnapshot();
    });
    test('add-postcss', async () => {
        const outputDirectory = './dist';
        const options = {outputDirectory, skipInstall};
        await run(createPackageJson, {});
        await run(addPostcss, options);
        const contents = fileContents('./postcss.config.js');
        expect(contents).toMatchSnapshot();
        const pkg = fileContents('./package.json');
        expect(pkg).toMatchSnapshot();
    });
    test('add-rollup', async () => {
        const outputDirectory = './dist';
        const sourceDirectory = './src';
        const options = {outputDirectory, skipInstall, sourceDirectory};
        await run(createPackageJson, {});
        await run(addEslint, options);
        await run(addRollup, options);
        const pkg = fileContents('package.json');
        const contents = fileContents('rollup.config.js');
        expect(pkg).toMatchSnapshot();
        expect(contents).toMatchSnapshot();
    });
    test('add-rollup (with React)', async () => {
        const outputDirectory = './dist';
        const sourceDirectory = './src';
        const useReact = true;
        const options = {outputDirectory, skipInstall, sourceDirectory, useReact};
        await run(createPackageJson, {});
        await run(addEslint, options);
        await run(addRollup, options);
        const pkg = fileContents('package.json');
        const contents = fileContents('rollup.config.js');
        expect(pkg).toMatchSnapshot();
        expect(contents).toMatchSnapshot();
    });
    test('add-webpack', async () => {
        const outputDirectory = './dist';
        const sourceDirectory = 'src';
        const useReact = false;
        const options = {outputDirectory, skipInstall, sourceDirectory, useReact};
        await run(createPackageJson, {});
        const pre = fileContents('./package.json');
        expect(pre).toMatchSnapshot();
        await run(addBabel, options);
        await run(addEslint, options);
        await run(addWebpack, options);
        const cfg = fileContents('.eslintrc.js');
        const tree = getDirectoryTree(tempDirectory);
        const contents = fileContents('./webpack.config.js');
        const post = fileContents('./package.json');
        expect(cfg).toMatchSnapshot();
        expect(tree).toMatchSnapshot();
        expect(contents).toMatchSnapshot();
        expect(post).toMatchSnapshot();
    });
    test('add-webpack (with React)', async () => {
        const outputDirectory = './dist';
        const sourceDirectory = 'src';
        const useReact = true;
        const options = {outputDirectory, skipInstall, sourceDirectory, useReact};
        await run(createPackageJson, {});
        const pre = fileContents('./package.json');
        expect(pre).toMatchSnapshot();
        await run(addBabel, options);
        await run(addEslint, options);
        await run(addWebpack, options);
        const cfg = fileContents('.eslintrc.js');
        const tree = getDirectoryTree(tempDirectory);
        const contents = fileContents('./webpack.config.js');
        const post = fileContents('./package.json');
        expect(cfg).toMatchSnapshot();
        expect(tree).toMatchSnapshot();
        expect(contents).toMatchSnapshot();
        expect(post).toMatchSnapshot();
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
    test('with Parcel.js', async () => {

    });
    test('with Rollup.js', async () => {

    });
});
describe('"Remove" commands', () => {
    let tempDirectory;
    const skipInstall = true;
    const [setTempDir, cleanupTempDir] = useTemporaryDirectory();
    beforeEach(async () => {
        tempDirectory = await setTempDir();
        process.chdir(tempDirectory);
    });
    afterEach(async () => {
        await cleanupTempDir();
    });
    test('remove a11y', async () => {
        const outputDirectory = './dist';
        const options = {outputDirectory, skipInstall};
        await run(createPackageJson, {});
        await run(addA11y, options);
        const pre = fileContents('package.json');
        await run(removeA11y, {});
        const post = fileContents('package.json');
        expect(pre).toMatchSnapshot();
        expect(post).toMatchSnapshot();
    });
    test('remove browsersync', async () => {
        const sourceDirectory = 'src';
        const outputDirectory = './dist';
        const options = {outputDirectory, skipInstall, sourceDirectory};
        await run(createPackageJson, {});
        await run(addWebpack, options);
        await run(addPostcss, options);
        await run(addBrowsersync, options);
        const pre = fileContents('package.json');
        await run(removeBrowsersync, {});
        const post = fileContents('package.json');
        expect(pre).toMatchSnapshot();
        expect(post).toMatchSnapshot();
    });
    test('remove parcel', async () => {
        const outputDirectory = './dist';
        const options = {outputDirectory, skipInstall};
        await run(createPackageJson, {});
        await run(addParcel, options);
        const pre = fileContents('./package.json');
        const preTree = getDirectoryTree(tempDirectory);
        await run(removeParcel, {});
        const post = fileContents('./package.json');
        const postTree = getDirectoryTree(tempDirectory);
        expect(pre).toMatchSnapshot();
        expect(preTree).toMatchSnapshot();
        expect(post).toMatchSnapshot();
        expect(postTree).toMatchSnapshot();
    });
    test('remove postcss', async () => {
        const outputDirectory = './dist';
        const options = {outputDirectory, skipInstall};
        await run(createPackageJson, {});
        await run(addPostcss, options);
        const pre = fileContents('./package.json');
        const preTree = getDirectoryTree(tempDirectory);
        await run(removePostcss, {});
        const post = fileContents('./package.json');
        const postTree = getDirectoryTree(tempDirectory);
        expect(pre).toMatchSnapshot();
        expect(preTree).toMatchSnapshot();
        expect(post).toMatchSnapshot();
        expect(postTree).toMatchSnapshot();
    });
    test('remove rollup', async () => {
        const sourceDirectory = 'src';
        const outputDirectory = './dist';
        const options = {outputDirectory, skipInstall, sourceDirectory};
        await run(createPackageJson, {});
        await run(addRollup, options);
        const pre = fileContents('package.json');
        const preTree = getDirectoryTree(tempDirectory);
        await run(removeRollup, options);
        const post = fileContents('package.json');
        const postTree = getDirectoryTree(tempDirectory);
        expect(pre).toMatchSnapshot();
        expect(preTree).toMatchSnapshot();
        expect(post).toMatchSnapshot();
        expect(postTree).toMatchSnapshot();
    });
    test('remove webpack', async () => {
        const sourceDirectory = 'src';
        const outputDirectory = './dist';
        const options = {outputDirectory, skipInstall, sourceDirectory};
        await run(createPackageJson, {});
        await run(addWebpack, options);
        const preTree = getDirectoryTree(tempDirectory);
        const prePkg = fileContents('./package.json');
        expect(preTree).toMatchSnapshot();
        expect(prePkg).toMatchSnapshot();
        await run(removeWebpack, {});
        const postTree = getDirectoryTree(tempDirectory);
        const postPkg = fileContents('./package.json');
        expect(postTree).toMatchSnapshot();
        expect(postPkg).toMatchSnapshot();
    });
});
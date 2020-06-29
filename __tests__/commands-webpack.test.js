import {fileContents, getDirectoryTree, run, useTemporaryDirectory} from './tomo-test';
import {createPackageJson} from '../src/commands/common';
import addBabel from '../src/commands/add-babel';
import addEslint from '../src/commands/add-eslint';
import {addWebpack, removeWebpack} from '../src/commands/add-webpack';

jest.mock('is-online', () => (async () => true));

describeOnlyOnLinux('Webpack', () => {
    let tempDirectory;
    const skipInstall = true;
    const useReact = true;
    const omit = ['extension', 'path', 'size', 'type'];
    const [setTempDir, cleanupTempDir] = useTemporaryDirectory();
    beforeEach(async () => {
        tempDirectory = await setTempDir();
        process.chdir(tempDirectory);
    });
    afterEach(async () => {
        await cleanupTempDir();
    });
    test('Add support', async () => {
        await run(createPackageJson, {});
        await run(addBabel, {skipInstall});
        await run(addEslint, {skipInstall});
        await run(addWebpack, {skipInstall});
        const tree = getDirectoryTree(tempDirectory, {omit});
        const packageJson = fileContents('./package.json');
        const webpackConfig = fileContents('./webpack.config.js');
        expect(tree).toMatchSnapshot();
        expect(packageJson).toMatchSnapshot();
        expect(webpackConfig).toMatchSnapshot();
    });
    test('Add support (+React)', async () => {
        await run(createPackageJson, {});
        await run(addBabel, {skipInstall, useReact});
        await run(addEslint, {skipInstall, useReact});
        await run(addWebpack, {skipInstall, useReact});
        const tree = getDirectoryTree(tempDirectory, {omit});
        const packageJson = fileContents('./package.json');
        const eslintConfig = fileContents('./.eslintrc.js');
        const webpackConfig = fileContents('./webpack.config.js');
        expect(tree).toMatchSnapshot();
        expect(packageJson).toMatchSnapshot();
        expect(eslintConfig).toMatchSnapshot();
        expect(webpackConfig).toMatchSnapshot();
    });
    test('Remove support', async () => {
        await run(createPackageJson, {});
        await run(addBabel, {skipInstall});
        await run(addEslint, {skipInstall});
        await run(addWebpack, {skipInstall});
        await run(removeWebpack, {skipInstall});
        const tree = getDirectoryTree(tempDirectory, {omit});
        const packageJson = fileContents('./package.json');
        expect(tree).toMatchSnapshot();
        expect(packageJson).toMatchSnapshot();
    });
});